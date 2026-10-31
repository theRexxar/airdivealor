/** The Dive courses page as the CMS sees it. The courses themselves are the "courses" collection (lib/cms/course-fields.ts). */
import { LEVEL_OPTIONS } from "./course-fields";
import { F, schemaFor } from "./fields";
import { seoSection, type SectionDef } from "./sections";

export const COURSES_SECTIONS: SectionDef[] = [
  seoSection(),
  {
    key: "detail",
    label: "Course pages",
    description: "Shared texts on every course page (/dive-courses/…): booking, what's not included, requirements and the closing box.",
    fixed: true,
    fields: [
      F.text("bookMessage", "WhatsApp booking message", { max: 300, help: "{course} and {price} are filled in. Also used by “Book now” on the course cards." }),
      F.i18n("bookLabel", "Book button (top bar)"),
      F.i18n("includedLead", "Text above “Not included”", { multiline: true }),
      F.list("notIncluded", "Not included", "Line", [F.i18n("text", "Text", { required: true })], { max: 10, titleKey: "text" }),
      F.i18n("medical", "Requirement: medical", { multiline: true }),
      F.i18n("insurance", "Requirement: insurance", { multiline: true }),
      F.i18n("flying", "Requirement: flying after", { multiline: true }),
      F.i18n("reqNote", "Note next to the requirements", { multiline: true }),
      F.i18n("ctaTitle", "Closing box: title"),
      F.i18n("ctaText", "Closing box: text", { multiline: true }),
      F.i18n("ctaLabel", "Closing box: book button"),
    ],
  },
  {
    key: "hero",
    label: "Hero",
    description: "Title, intro and the agency logos at the top of the page.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.i18n("lead", "Intro text", { multiline: true }),
      F.list("logos", "Logos", "Logo", [F.image("image", "Logo"), F.text("alt", "Description", { max: 80, help: "e.g. SDI certified" })], { max: 4, titleKey: "alt" }),
    ],
  },
  {
    key: "list",
    label: "Course list",
    description: "The level filters and the course cards. The cards come from Dive courses › Courses.",
    fields: [
      F.list(
        "filters",
        "Level filters",
        "Filter",
        [F.i18n("label", "Button label", { required: true }), F.select("level", "Shows", [{ value: "", label: "All courses" }, ...LEVEL_OPTIONS])],
        { max: 8, titleKey: "label" },
      ),
      F.i18n("moreLabel", "Card link to the course page"),
      F.i18n("bookLabel", "Card book button"),
    ],
  },
  {
    key: "cta",
    label: "Call to action",
    description: "The dark band at the bottom of the page.",
    fields: [
      F.i18n("title", "Title", { required: true }),
      F.i18n("text", "Text", { multiline: true }),
      F.i18n("primaryLabel", "WhatsApp button"),
      F.text("primaryMessage", "WhatsApp message"),
      F.i18n("secondaryLabel", "Second button"),
      F.url("secondaryUrl", "Second button link", "A WhatsApp or tel: link shows a phone icon."),
    ],
  },
];

export const COURSES_SCHEMAS = Object.fromEntries(COURSES_SECTIONS.map((s) => [s.key, schemaFor(s.fields)]));
