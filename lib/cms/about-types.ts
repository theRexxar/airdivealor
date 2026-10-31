/** Content shapes for the About us page. Mirrors about-sections.ts. */
import type { I18n, MediaRef } from "./fields";
import type { ResolvedMedia } from "./home-types";

export interface AboutContent {
  seo: { title: I18n; description: I18n; ogImage: MediaRef };
  hero: { eyebrow: I18n; title: I18n; lead: I18n; image: MediaRef; facts: { icon: string; value: I18n; label: I18n }[] };
  story: { eyebrow: I18n; title: I18n; paragraphs: { text: I18n }[]; hostsLabel: I18n; hosts: { name: string }[]; hostsText: I18n; gallery: { photo: MediaRef }[] };
  name: { eyebrow: I18n; title: I18n; text: I18n; cards: { icon: string; label: I18n; word: I18n; text: I18n }[] };
  boats: { eyebrow: I18n; title: I18n; items: { name: string; photo: MediaRef; text: I18n; specs: { icon: string; label: I18n; value: I18n }[] }[] };
  cta: { title: I18n; text: I18n; primaryLabel: I18n; primaryMessage: string; secondaryLabel: I18n; secondaryUrl: string };
}

/** Public API: the About us page. */
export interface PublishedAbout {
  content: AboutContent;
  order: string[];
  media: Record<string, ResolvedMedia>;
  publishedAt: string | null;
}
