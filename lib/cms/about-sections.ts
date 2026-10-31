/** The About us page as the CMS sees it. */
import { F, schemaFor } from "./fields";
import { ICON_OPTIONS, seoSection, type SectionDef } from "./sections";

export const ABOUT_SECTIONS: SectionDef[] = [
  seoSection(),
  {
    key: "hero",
    label: "Hero",
    description: "Photo, title, intro and the key facts at the top of the page.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.i18n("lead", "Intro text", { multiline: true }),
      F.image("image", "Background photo"),
      F.list("facts", "Key facts", "Fact", [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("value", "Value", { required: true, help: "e.g. March 2017" }), F.i18n("label", "Label")], {
        max: 4,
        titleKey: "value",
      }),
    ],
  },
  {
    key: "story",
    label: "Our story",
    description: "The founding story, your hosts and the photo gallery.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.list("paragraphs", "Paragraphs", "Paragraph", [F.i18n("text", "Text", { required: true, multiline: true })], { max: 5, titleKey: "text" }),
      F.i18n("hostsLabel", "Hosts: label", { help: "e.g. “Your hosts”. Leave empty to hide the hosts box." }),
      F.list("hosts", "Hosts", "Host", [F.text("name", "Name", { required: true, max: 40 })], { max: 6, titleKey: "name" }),
      F.i18n("hostsText", "Hosts: text", { multiline: true }),
      F.list("gallery", "Photo gallery", "Photo", [F.image("photo", "Photo")], { max: 24, help: "Square thumbnails; click to enlarge. Shown in this order." }),
    ],
  },
  {
    key: "name",
    label: "Our name",
    description: "Why “Air”: the text and the two meaning cards.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.i18n("text", "Text", { multiline: true }),
      F.list(
        "cards",
        "Cards",
        "Card",
        [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("label", "Label", { help: "e.g. “In English”." }), F.i18n("word", "Word", { required: true }), F.i18n("text", "Text", { multiline: true })],
        { max: 4, titleKey: "word" },
      ),
    ],
  },
  {
    key: "boats",
    label: "Our boats",
    description: "The dive boats, with photo, text and specs.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.list(
        "items",
        "Boats",
        "Boat",
        [
          F.text("name", "Name", { required: true, max: 60 }),
          F.image("photo", "Photo"),
          F.i18n("text", "Text", { multiline: true }),
          F.list("specs", "Specs", "Spec", [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("label", "Label", { required: true }), F.i18n("value", "Value", { required: true })], { max: 6, titleKey: "label" }),
        ],
        { max: 4, titleKey: "name" },
      ),
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

export const ABOUT_SCHEMAS = Object.fromEntries(ABOUT_SECTIONS.map((s) => [s.key, schemaFor(s.fields)]));
