import { eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { checkPassword, clientInfo, createSession } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, rateLimit } from "@/lib/server/http";

export const POST = handle(async (req) => {
  const { email, password } = await body(req, z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(200) }));
  const { ip } = await clientInfo();
  await rateLimit(`login:ip:${ip}`, 20, 15 * 60);
  await rateLimit(`login:email:${email}`, 8, 15 * 60);
  const u = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  // Same message for unknown email and wrong password, so the form does not reveal which accounts exist.
  if (!u || u.status !== "active" || !(await checkPassword(password, u.passwordHash))) {
    await audit(u?.id ?? null, "auth.login_failed", email);
    throw new HttpError(401, "Email or password is incorrect.");
  }
  await createSession(u.id);
  await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, u.id));
  await audit(u.id, "auth.login");
  return ok({ ok: true });
});
