/** Content shapes for the Facilities and rates page. Mirrors facilities-sections.ts. */
import type { I18n, MediaRef } from "./fields";
import type { ResolvedMedia } from "./home-types";

export interface GalleryPhoto {
  photo: MediaRef;
  label: I18n;
  title: I18n;
}
export interface IconItem {
  icon: string;
  text: I18n;
}

export interface RatePackage {
  name: I18n;
  sub: I18n;
  rows: { days: number; nights: number; dives: number; price: string }[];
  cards: { icon: string; label: I18n; price: string; per: I18n; message: string }[];
  tag: I18n;
  included: { text: I18n }[];
  excluded: { text: I18n }[];
  note: I18n;
}

export interface FacilitiesContent {
  seo: { title: I18n; description: I18n; ogImage: MediaRef };
  hero: { eyebrow: I18n; title: I18n; lead: I18n; image: MediaRef };
  glance: { items: { label: I18n; title: I18n; from: I18n; price: string; note: I18n; package: number }[]; moreLabel: I18n };
  stay: { eyebrow: I18n; title: I18n; paragraphs: { text: I18n }[]; gallery: GalleryPhoto[]; listTitle: I18n; items: IconItem[]; badge: I18n; note: I18n };
  diving: { eyebrow: I18n; title: I18n; paragraphs: { text: I18n }[]; gallery: GalleryPhoto[]; listTitle: I18n; items: IconItem[]; ratesLabel: I18n };
  boats: { title: I18n; lead: I18n; items: { name: string; photo: MediaRef; text: I18n; specs: { icon: string; label: I18n; value: I18n }[] }[] };
  gear: { title: I18n; lead: I18n; items: { icon: string; title: I18n; text: I18n }[] };
  rates: { eyebrow: I18n; title: I18n; lead: I18n; packages: RatePackage[]; rowMessage: string; note: I18n };
  cta: { title: I18n; text: I18n; primaryLabel: I18n; primaryMessage: string; secondaryLabel: I18n; secondaryUrl: string };
}

/** Public API: the Facilities and rates page. */
export interface PublishedFacilities {
  content: FacilitiesContent;
  order: string[];
  media: Record<string, ResolvedMedia>;
  publishedAt: string | null;
}
