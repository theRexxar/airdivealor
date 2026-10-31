import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { activeSuperAdmins, setUserRoles } from "@/lib/server/users-service";

type Ctx = { params: Promise<{ id: string }> };

async function target(ctx: Ctx) {
  const id = Number((await ctx.params).id);
  const u = await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  if (!u) throw new HttpError(404, "User not found.");
  return u;
}

/** Edit name, roles or status (active / disabled). */
export const PATCH = handle(async (req, ctx: Ctx) => {
  const me = await requireUser("users.manage");
  const u = await target(ctx);
  const data = await body(req, z.object({ name: z.string().trim().min(1).max(120).optional(), roleIds: z.array(z.number().int()).min(1, "Choose at least one role.").optional(), status: z.enum(["active", "disabled"]).optional() }));
  const supers = await activeSuperAdmins();
  const isSuper = supers.includes(u.id);
  if (data.roleIds) {
    const roles = await db.select().from(schema.roles).where(inArray(schema.roles.id, data.roleIds));
    if (roles.length !== data.roleIds.length) throw new HttpError(422, "Unknown role.");
    const iAmSuper = supers.includes(me.id);
    if (!iAmSuper && (roles.some((r) => r.isSystem) || isSuper)) throw new HttpError(403, "Only a Super admin can change Super admin access.");
    if (isSuper && supers.length === 1 && !roles.some((r) => r.isSystem)) throw new HttpError(409, "This is the last Super admin. Give the role to someone else first.");
    await setUserRoles(u.id, data.roleIds);
  }
  if (data.status) {
    if (u.id === me.id && data.status === "disabled") throw new HttpError(409, "You can't disable your own account.");
    if (isSuper && data.status === "disabled" && supers.length === 1) throw new HttpError(409, "This is the last Super admin and can't be disabled.");
    if (u.status === "invited" && data.status === "active") throw new HttpError(409, "This user hasn't accepted the invitation yet.");
    if (data.status === "disabled") await db.delete(schema.sessions).where(eq(schema.sessions.userId, u.id));
  }
  await db.update(schema.users).set({ ...(data.name ? { name: data.name } : {}), ...(data.status ? { status: data.status } : {}) }).where(eq(schema.users.id, u.id));
  await audit(me.id, "user.updated", u.email, data);
  return ok({ ok: true });
});

/** Delete a user (their past changes keep an empty author). */
export const DELETE = handle(async (_req, ctx: Ctx) => {
  const me = await requireUser("users.manage");
  const u = await target(ctx);
  if (u.id === me.id) throw new HttpError(409, "You can't delete your own account.");
  const supers = await activeSuperAdmins();
  if (supers.includes(u.id) && !supers.includes(me.id)) throw new HttpError(403, "Only a Super admin can delete a Super admin.");
  if (supers.includes(u.id) && supers.length === 1) throw new HttpError(409, "This is the last Super admin.");
  await db.delete(schema.users).where(eq(schema.users.id, u.id));
  await audit(me.id, "user.deleted", u.email);
  return ok({ ok: true });
});
