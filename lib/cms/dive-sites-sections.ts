/** The Dive sites page as the CMS sees it. Site guides themselves are the "sites" collection (lib/cms/site-fields.ts). */
import { F, schemaFor } from "./fields";
import { eyebrowTitle, ICON_OPTIONS, seoSection, type SectionDef } from "./sections";

export const DIVE_SITES_SECTIONS: SectionDef[] = [
  seoSection(),
  {
    key: "guide",
    label: "Site guide pages",
    description: "Shared texts on every site guide page (/dive-sites/…): notes, the booking box and the WhatsApp message.",
    fixed: true,
    fields: [
      F.i18n("typicalNote", "Conditions note", { help: "Shown under the conditions cards." }),
      F.i18n("safetyNote", "Safety note", { multiline: true }),
      F.i18n("draftNote", "Note on unverified guides", { help: "Shown on guides marked “Still being checked”." }),
      F.i18n("ctaTitle", "Booking box: title"),
      F.i18n("ctaText", "Booking box: text", { multiline: true }),
      F.i18n("bookLabel", "Book button"),
      F.text("bookMessage", "WhatsApp message", { help: "{site} is replaced by the site name." }),
    ],
  },
  {
    key: "hero",
    label: "Hero",
    description: "Photo, title and intro at the top of the page.",
    fields: [F.i18n("eyebrow", "Eyebrow"), F.i18n("title", "Title", { required: true }), F.i18n("lead", "Intro text", { multiline: true }), F.image("image", "Background photo")],
  },
  {
    key: "highlights",
    label: "What Alor is known for",
    description: "The card of highlights that overlaps the hero.",
    fields: [
      F.list("items", "Highlights", "Highlight", [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("title", "Title", { required: true }), F.i18n("text", "Text", { multiline: true })], { max: 9, titleKey: "title" }),
    ],
  },
  {
    key: "list",
    label: "All sites",
    description: "The site cards with filters and “Load more”. The cards come from Dive site guides.",
    fields: [
      ...eyebrowTitle(),
      F.number("pageSize", "Cards per load", { min: 3, max: 48 }),
      F.list(
        "filters",
        "Filters",
        "Filter",
        [
          F.i18n("label", "Button label", { required: true }),
          F.text("match", "Matches dive types containing", { help: "Comma-separated words checked against each site's dive types (English), e.g. Wall, Drop-off. Leave empty for “All”." }),
        ],
        { max: 10, titleKey: "label" },
      ),
      F.i18n("note", "Note under the cards", { multiline: true }),
    ],
  },
  {
    key: "cta",
    label: "Call to action",
    description: "The band at the bottom of the page.",
    fields: [
      F.i18n("title", "Title", { required: true }),
      F.i18n("text", "Text", { multiline: true }),
      F.i18n("primaryLabel", "WhatsApp button"),
      F.text("primaryMessage", "WhatsApp message"),
      F.i18n("secondaryLabel", "Second button"),
      F.url("secondaryUrl", "Second button link"),
    ],
  },
];

export const DIVE_SITES_SCHEMAS = Object.fromEntries(DIVE_SITES_SECTIONS.map((s) => [s.key, schemaFor(s.fields)]));
