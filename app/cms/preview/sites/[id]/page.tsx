import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { can, currentUser } from "@/lib/server/auth";
import { PreviewClient } from "../../PreviewClient";

export const metadata: Metadata = { title: "Preview | Air Dive Alor CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** One dive site guide from its draft, for CMS users. */
export default async function SitePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const u = await currentUser();
  if (!u) redirect(`/cms/login?next=/cms/preview/sites/${id}`);
  if (!can(u, "sites.view")) redirect("/cms");
  return <PreviewClient kind="site" slug={id} anchors={{}} back={`/cms/collections/sites/${id}`} />;
}
