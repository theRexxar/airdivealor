import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITES } from "@/lib/sites";
import { SiteGuideView } from "./SiteGuideView";

export const dynamicParams = false;

export function generateStaticParams() {
  return SITES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SITES.find((x) => x.slug === slug);
  if (!s) return {};
  const title = `${s.name} dive site guide | Air Dive Alor`;
  return { title, description: s.intro, openGraph: { title, description: s.intro, images: s.photo ? [s.photo] : undefined } };
}

export default async function SiteGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SITES.some((s) => s.slug === slug)) notFound();
  return <SiteGuideView slug={slug} />;
}
