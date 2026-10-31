import { audit } from "@/lib/server/audit";
import { currentUser, destroySession } from "@/lib/server/auth";
import { handle, ok } from "@/lib/server/http";

export const POST = handle(async () => {
  const u = await currentUser();
  await destroySession();
  if (u) await audit(u.id, "auth.logout");
  return ok({ ok: true });
});
