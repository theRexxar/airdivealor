import type { Metadata } from "next";
import { getAbout } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { AboutView } from "./AboutView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAbout();
  return seoMetadata(data.content.seo, data.media, "/about-us");
}

export default async function AboutPage() {
  return <AboutView data={await getAbout()} />;
}
