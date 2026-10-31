import { eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { clientInfo } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { body, handle, ok, rateLimit } from "@/lib/server/http";
import { sendPasswordLink } from "@/lib/server/password-flow";

/** Always answers the same way, whether or not the email has an account. */
export const POST = handle(async (req) => {
  const { email } = await body(req, z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email address.") }));
  const { ip } = await clientInfo();
  await rateLimit(`forgot:ip:${ip}`, 10, 60 * 60);
  await rateLimit(`forgot:email:${email}`, 3, 60 * 60);
  const u = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (u && u.status === "active") {
    try {
      await sendPasswordLink(u, "reset");
      await audit(u.id, "auth.reset_requested");
    } catch (e) {
      console.error("reset email failed", e);
    }
  }
  return ok({ ok: true });
});
