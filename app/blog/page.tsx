import type { Metadata } from "next";
import { getBlog } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { BlogIndex } from "./BlogIndex";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getBlog();
  return seoMetadata(data.content.seo, data.media, "/blog");
}

export default async function BlogPage() {
  return <BlogIndex data={await getBlog()} />;
}
