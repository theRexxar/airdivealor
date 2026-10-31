import type { Metadata } from "next";
import type { I18n, MediaRef } from "./fields";
import type { ResolvedMedia } from "./home-types";

/** Page metadata from a CMS "SEO and sharing" section. */
export function seoMetadata(seo: { title: I18n; description: I18n; ogImage: MediaRef }, media: Record<string, ResolvedMedia>, path: string): Metadata {
  const image = seo.ogImage.mediaId ? media[seo.ogImage.mediaId]?.url : seo.ogImage.url;
  return {
    title: seo.title.en,
    description: seo.description.en,
    alternates: { languages: { en: path, id: path } },
    openGraph: { title: seo.title.en, description: seo.description.en, type: "website", locale: "en_US", alternateLocale: ["id_ID"], images: image ? [{ url: image }] : undefined },
  };
}
