import { publishedHome } from "@/lib/server/home-service";
import { handle, ok, requireUser } from "@/lib/server/http";

/** The Home page with unpublished drafts, for the CMS preview. */
export const GET = handle(async () => {
  await requireUser("home.view");
  return ok(await publishedHome({ draft: true }));
});
