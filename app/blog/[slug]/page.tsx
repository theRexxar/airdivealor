import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/cms/fetch";
import { PostView } from "./PostView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getPost((await params).slug);
  if (!data) return {};
  const p = data.post;
  const image = p.cover.mediaId ? data.media[p.cover.mediaId]?.url : p.cover.url;
  const title = `${p.title.en} | Air Dive Alor`;
  return { title, description: p.excerpt.en, openGraph: { title, description: p.excerpt.en, type: "article", publishedTime: p.date, images: image ? [image] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getPost((await params).slug);
  if (!data) notFound();
  return <PostView data={data} />;
}
