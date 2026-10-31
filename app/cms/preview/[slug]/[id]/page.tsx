import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { collectionDef } from "@/lib/cms/registry";
import { can, currentUser } from "@/lib/server/auth";
import { PreviewClient } from "../../PreviewClient";

export const metadata: Metadata = { title: "Preview | Air Dive Alor CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** One collection item (a dive site guide or a course) from its draft, for CMS users. The slug is the collection key. */
export default async function ItemPreviewPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug: key, id } = await params;
  if (!collectionDef(key)) notFound();
  const u = await currentUser();
  if (!u) redirect(`/cms/login?next=/cms/preview/${key}/${id}`);
  if (!can(u, `${key}.view`)) redirect("/cms");
  return <PreviewClient kind="item" collection={key} slug={id} anchors={{}} back={`/cms/collections/${key}/${id}`} />;
}
