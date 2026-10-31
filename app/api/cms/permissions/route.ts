import { PERMISSIONS } from "@/lib/cms/permissions";
import { handle, ok, requireUser } from "@/lib/server/http";

export const GET = handle(async () => {
  await requireUser("users.view");
  return ok({ permissions: PERMISSIONS });
});
