import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POSTS, bySlug } from "@/lib/blog";
import { PostView } from "./PostView";

export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = bySlug((await params).slug);
  if (!p) return {};
  const title = `${p.title} | Air Dive Alor`;
  return {
    title,
    description: p.excerpt,
    openGraph: { title, description: p.excerpt, type: "article", publishedTime: p.date, images: [p.cover] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!bySlug(slug)) notFound();
  return <PostView slug={slug} />;
}
