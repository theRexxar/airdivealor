import type { Metadata } from "next";
import { getDiveSites } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { SitesView } from "./SitesView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDiveSites();
  return seoMetadata(data.content.seo, data.media, "/dive-sites");
}

export default async function SitesPage() {
  return <SitesView data={await getDiveSites()} />;
}
