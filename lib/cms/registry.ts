/**
 * Everything the CMS manages: pages (made of sections) and collections (lists of items, like dive sites).
 * Permissions, API routes and screens are all derived from this list.
 */
import type { Field } from "./fields";
import { DIVE_SITES_SECTIONS } from "./dive-sites-sections";
import { FACILITIES_SECTIONS } from "./facilities-sections";
import { HOME_SECTIONS } from "./home-sections";
import type { SectionDef } from "./sections";
import { SITE_FIELDS } from "./site-fields";

export interface PageDef {
  slug: string;
  label: string;
  /** Live URL of the page on the website. */
  href: string;
  sections: SectionDef[];
  /** Element id on the live page for each section (used by the preview to jump to it). */
  anchors?: Record<string, string>;
}

export interface CollectionDef {
  key: string;
  label: string;
  itemLabel: string;
  description: string;
  fields: Field[];
  /** Field shown as the item title in lists. */
  titleField: string;
  /** Live URL for one item. */
  itemHref: (slug: string) => string;
}

export const PAGES: PageDef[] = [
  {
    slug: "home",
    label: "Home",
    href: "/",
    sections: HOME_SECTIONS,
    anchors: { prices: "b-prices", why: "b-why", sites: "b-sites", stay: "b-stay", reviews: "b-reviews", faq: "b-faq", book: "b-book" },
  },
  { slug: "dive-sites", label: "Dive sites", href: "/dive-sites", sections: DIVE_SITES_SECTIONS, anchors: { list: "sites" } },
  { slug: "facilities", label: "Facilities and rates", href: "/facilities-and-rates", sections: FACILITIES_SECTIONS, anchors: { stay: "stay", diving: "diving", rates: "rates" } },
];

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "sites",
    label: "Dive site guides",
    itemLabel: "dive site",
    description: "Each dive site has a card on the Dive sites page and its own guide page. The Home page site picker uses them too.",
    fields: SITE_FIELDS,
    titleField: "name",
    itemHref: (slug) => `/dive-sites/${slug}`,
  },
];

export const pageDef = (slug: string) => PAGES.find((p) => p.slug === slug);
export const collectionDef = (key: string) => COLLECTIONS.find((c) => c.key === key);
export const sectionDefOf = (page: string, key: string) => pageDef(page)?.sections.find((s) => s.key === key);
