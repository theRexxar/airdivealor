import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSite } from "@/lib/cms/fetch";
import { SiteGuideView } from "./SiteGuideView";

/** Site guides come from the CMS, so new sites work without a rebuild. */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getSite((await params).slug);
  if (!data) return {};
  const s = data.site;
  const title = `${s.name} dive site guide | Air Dive Alor`;
  const image = s.photo.mediaId ? data.media[s.photo.mediaId]?.url : s.photo.url;
  return { title, description: s.intro.en, openGraph: { title, description: s.intro.en, images: image ? [image] : undefined } };
}

export default async function SiteGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getSite((await params).slug);
  if (!data) notFound();
  return <SiteGuideView data={data} />;
}
