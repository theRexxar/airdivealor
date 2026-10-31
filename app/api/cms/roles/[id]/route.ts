import { and, eq, ne } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { roleInput, setRolePermissions } from "@/lib/server/roles-service";

type Ctx = { params: Promise<{ id: string }> };

async function target(ctx: Ctx) {
  const r = await db.query.roles.findFirst({ where: eq(schema.roles.id, Number((await ctx.params).id)) });
  if (!r) throw new HttpError(404, "Role not found.");
  return r;
}

export const PATCH = handle(async (req, ctx: Ctx) => {
  const me = await requireUser("roles.manage");
  const r = await target(ctx);
  if (r.isSystem) throw new HttpError(409, "The Super admin role always has every permission and can't be edited.");
  const data = await body(req, roleInput);
  if (await db.query.roles.findFirst({ where: and(eq(schema.roles.name, data.name), ne(schema.roles.id, r.id)) })) throw new HttpError(409, "A role with this name already exists.", [{ path: ["name"], message: "Already in use." }]);
  await db.update(schema.roles).set({ name: data.name, description: data.description }).where(eq(schema.roles.id, r.id));
  await setRolePermissions(r.id, data.permissions);
  await audit(me.id, "role.updated", data.name, { permissions: data.permissions.length });
  return ok({ ok: true });
});

export const DELETE = handle(async (_req, ctx: Ctx) => {
  const me = await requireUser("roles.manage");
  const r = await target(ctx);
  if (r.isSystem) throw new HttpError(409, "The Super admin role can't be deleted.");
  const holder = await db.query.userRoles.findFirst({ where: eq(schema.userRoles.roleId, r.id) });
  if (holder) throw new HttpError(409, "Some users still have this role. Move them to another role first.");
  await db.delete(schema.roles).where(eq(schema.roles.id, r.id));
  await audit(me.id, "role.deleted", r.name);
  return ok({ ok: true });
});
