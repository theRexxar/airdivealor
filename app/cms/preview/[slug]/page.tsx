import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { pageDef } from "@/lib/cms/registry";
import { can, currentUser } from "@/lib/server/auth";
import { PreviewClient } from "../PreviewClient";

export const metadata: Metadata = { title: "Preview | Air Dive Alor CMS", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

/** A page with unpublished drafts, for CMS users. */
export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const def = pageDef(slug);
  if (!def) notFound();
  const u = await currentUser();
  if (!u) redirect(`/cms/login?next=/cms/preview/${slug}`);
  if (!can(u, `${slug}.view`)) redirect("/cms");
  return <PreviewClient kind="page" slug={slug} anchors={def.anchors ?? {}} back={`/cms/pages/${slug}`} />;
}
