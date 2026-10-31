import type { Metadata } from "next";
import { getFacilities } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { FacilitiesView } from "./FacilitiesView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getFacilities();
  return seoMetadata(data.content.seo, data.media, "/facilities-and-rates");
}

export default async function FacilitiesPage() {
  return <FacilitiesView data={await getFacilities()} />;
}
