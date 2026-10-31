import { redirect } from "next/navigation";
import { COLLECTIONS, PAGES } from "@/lib/cms/registry";
import { can, currentUser } from "@/lib/server/auth";

/** Start on the first screen the user may open. */
export default async function CmsHome() {
  const u = await currentUser();
  const page = PAGES.find((p) => can(u, `${p.slug}.view`));
  if (page) redirect(`/cms/pages/${page.slug}`);
  const coll = COLLECTIONS.find((c) => can(u, `${c.key}.view`));
  if (coll) redirect(`/cms/collections/${coll.key}`);
  if (can(u, "media.view")) redirect("/cms/media");
  if (can(u, "users.view")) redirect("/cms/users");
  redirect("/cms/account");
}
