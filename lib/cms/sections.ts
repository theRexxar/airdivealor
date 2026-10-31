/** Shared building blocks for page section definitions. */
import { F, type Field } from "./fields";

export interface SectionDef {
  key: string;
  label: string;
  /** Depth label used in the page and depth gauge, e.g. 5 for "5 m". */
  depth?: number;
  description: string;
  fields: Field[];
  /** Page-level data (SEO, shared texts): cannot be hidden or reordered. */
  fixed?: boolean;
}

export const ICON_OPTIONS = [
  "badge-check", "shield-check", "users", "star", "award", "fish", "mountain", "waves", "eye", "anchor", "bed", "plane", "utensils",
  "clock", "coffee", "camera", "ship", "life-buoy", "map-pin", "sun", "heart", "message-circle", "flower-2", "search", "wind", "compass",
].map((v) => ({ value: v, label: v }));

export const eyebrowTitle = (title = "Title"): Field[] => [
  F.i18n("eyebrow", "Eyebrow", { help: "Small label above the title, e.g. “5 m · Prices”." }),
  F.i18n("title", title, { required: true }),
];

export const seoSection = (): SectionDef => ({
  key: "seo",
  label: "SEO and sharing",
  description: "Browser title, search description and the image shown when the page is shared.",
  fixed: true,
  fields: [
    F.i18n("title", "Page title", { required: true, max: 120 }),
    F.i18n("description", "Meta description", { multiline: true, max: 300, help: "About 150–160 characters." }),
    F.image("ogImage", "Share image", "1200 × 630 px works best."),
  ],
});
