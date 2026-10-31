import type { Metadata } from "next";
import { getHome } from "@/lib/cms/home-fetch";
import { HomeView } from "./_home/HomeView";

/** Rendered per request from the cached CMS API response (see lib/cms/home-fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getHome();
  const seo = data.content.seo;
  const image = seo.ogImage.mediaId ? data.media[seo.ogImage.mediaId]?.url : seo.ogImage.url;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { languages: { en: "/", id: "/" } },
    openGraph: {
      title: seo.title.en,
      description: seo.description.en,
      type: "website",
      locale: "en_US",
      alternateLocale: ["id_ID"],
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function HomePage() {
  const { data } = await getHome();
  return <HomeView data={data} />;
}
