import { redirect } from "next/navigation";
import { can, currentUser } from "@/lib/server/auth";

/** Start on the first screen the user may open. */
export default async function CmsHome() {
  const u = await currentUser();
  if (can(u, "home.view")) redirect("/cms/pages/home");
  if (can(u, "dive-sites.view")) redirect("/cms/pages/dive-sites");
  if (can(u, "sites.view")) redirect("/cms/collections/sites");
  if (can(u, "media.view")) redirect("/cms/media");
  if (can(u, "users.view")) redirect("/cms/users");
  redirect("/cms/account");
}
