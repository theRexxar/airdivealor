/** The Facilities and rates page as the CMS sees it. */
import { F, schemaFor, type Field } from "./fields";
import { eyebrowTitle, ICON_OPTIONS, seoSection, type SectionDef } from "./sections";

const paragraphs = (): Field => F.list("paragraphs", "Paragraphs", "Paragraph", [F.i18n("text", "Text", { required: true, multiline: true })], { max: 4, titleKey: "text" });
const gallery = (): Field =>
  F.list("gallery", "Photo gallery", "Photo", [F.image("photo", "Photo", "Leave empty to show a “Photo coming soon” placeholder."), F.i18n("label", "Thumbnail label", { required: true }), F.i18n("title", "Caption", { required: true })], {
    min: 1,
    max: 8,
    titleKey: "label",
  });
const iconList = (label: string): Field[] => [
  F.i18n("listTitle", "List title", { help: label }),
  F.list("items", "List", "Item", [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("text", "Text", { required: true })], { max: 14, titleKey: "text" }),
];
const textList = (key: string, label: string): Field => F.list(key, label, "Line", [F.i18n("text", "Text", { required: true })], { max: 10, titleKey: "text" });

export const FACILITIES_SECTIONS: SectionDef[] = [
  seoSection(),
  {
    key: "hero",
    label: "Hero",
    description: "Photo, title and intro at the top of the page.",
    fields: [F.i18n("eyebrow", "Eyebrow"), F.i18n("title", "Title", { required: true }), F.i18n("lead", "Intro text", { multiline: true }), F.image("image", "Background photo")],
  },
  {
    key: "glance",
    label: "Rates at a glance",
    description: "The price cards that overlap the hero. Each card opens one package in the rates table.",
    fields: [
      F.list(
        "items",
        "Cards",
        "Card",
        [
          F.i18n("label", "Label", { required: true }),
          F.i18n("title", "Title", { required: true }),
          F.i18n("from", "Price prefix", { help: "e.g. “From”." }),
          F.text("price", "Price", { required: true, max: 40, help: "e.g. IDR 9,800,000" }),
          F.i18n("note", "Note"),
          F.number("package", "Opens package number", { min: 1, max: 10, help: "1 is the first package in “Diving rates”." }),
        ],
        { max: 4, titleKey: "label" },
      ),
      F.i18n("moreLabel", "Link text", { help: "e.g. “See rates”." }),
    ],
  },
  {
    key: "stay",
    label: "Stay",
    description: "Rooms, meals and village life, with a photo gallery and the room list.",
    fields: [...eyebrowTitle(), paragraphs(), gallery(), ...iconList("e.g. “In every room”."), F.i18n("badge", "Badge next to the list title"), F.i18n("note", "Note under the list", { multiline: true })],
  },
  {
    key: "diving",
    label: "Diving",
    description: "The dive day, with a photo gallery and the list of what's ready for you.",
    fields: [...eyebrowTitle(), paragraphs(), gallery(), ...iconList("e.g. “Every dive day”."), F.i18n("ratesLabel", "Button to the rates")],
  },
  {
    key: "boats",
    label: "Boats",
    description: "The dive boats, with photo, text and specs.",
    fields: [
      F.i18n("title", "Title", { required: true }),
      F.i18n("lead", "Intro text", { multiline: true }),
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
    key: "gear",
    label: "Gear and equipment",
    description: "Cards for dive gear, safety gear, tanks and so on.",
    fields: [
      F.i18n("title", "Title", { required: true }),
      F.i18n("lead", "Intro text", { multiline: true }),
      F.list("items", "Cards", "Card", [F.select("icon", "Icon", ICON_OPTIONS), F.i18n("title", "Title", { required: true }), F.i18n("text", "Text", { multiline: true })], { max: 9, titleKey: "title" }),
    ],
  },
  {
    key: "rates",
    label: "Diving rates",
    description: "The packages with their prices, what's included, and the WhatsApp message for each row.",
    fields: [
      ...eyebrowTitle(),
      F.i18n("lead", "Intro text", { multiline: true }),
      F.list(
        "packages",
        "Packages",
        "Package",
        [
          F.i18n("name", "Name", { required: true, help: "Also the tab label." }),
          F.i18n("sub", "Subtitle", { help: "e.g. “2 dives a day”." }),
          F.list(
            "rows",
            "Price table",
            "Row",
            [F.number("days", "Days", { min: 1, max: 60 }), F.number("nights", "Nights", { min: 0, max: 60 }), F.number("dives", "Dives", { min: 0, max: 200 }), F.text("price", "Price", { required: true, max: 40, help: "e.g. IDR 9,800,000" })],
            { max: 20, titleKey: "price", help: "Leave empty to show price cards instead (pay per dive)." },
          ),
          F.list(
            "cards",
            "Price cards",
            "Card",
            [
              F.select("icon", "Icon", ICON_OPTIONS),
              F.i18n("label", "Label", { required: true }),
              F.text("price", "Price", { required: true, max: 40 }),
              F.i18n("per", "Per", { help: "e.g. “per dive”." }),
              F.text("message", "WhatsApp message"),
            ],
            { max: 4, titleKey: "label", help: "Used when the price table is empty." },
          ),
          F.i18n("tag", "Tag", { help: "Optional, e.g. “10% off from 10 dives”." }),
          textList("included", "Included"),
          textList("excluded", "Not included"),
          F.i18n("note", "Note under the lists", { multiline: true }),
        ],
        { min: 1, max: 6, titleKey: "name" },
      ),
      F.text("rowMessage", "WhatsApp message for a table row", {
        max: 300,
        help: "{package}, {days}, {nights}, {dives} and {price} are filled in from the row.",
      }),
      F.i18n("note", "Note under the rates", { multiline: true }),
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

export const FACILITIES_SCHEMAS = Object.fromEntries(FACILITIES_SECTIONS.map((s) => [s.key, schemaFor(s.fields)]));
