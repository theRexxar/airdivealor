import { handle, ok, requireUser } from "@/lib/server/http";

export const GET = handle(async () => {
  const u = await requireUser();
  return ok({ id: u.id, email: u.email, name: u.name, roles: u.roles, permissions: [...u.permissions] });
});
