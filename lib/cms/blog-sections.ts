/** The Blog page as the CMS sees it. Stories and categories are the "posts" and "categories" collections. */
import { F, schemaFor } from "./fields";
import { seoSection, type SectionDef } from "./sections";

export const BLOG_SECTIONS: SectionDef[] = [
  seoSection(),
  {
    key: "post",
    label: "Story pages",
    description: "Shared texts on every story page (/blog/…): the closing box, “More stories” and the note on stories still on the old blog.",
    fixed: true,
    fields: [
      F.i18n("ctaTitle", "Closing box: title"),
      F.i18n("ctaText", "Closing box: text", { multiline: true }),
      F.i18n("ctaLabel", "Closing box: button"),
      F.text("ctaMessage", "Closing box: WhatsApp message", { max: 300, help: "{title} is replaced by the story title." }),
      F.i18n("moreTitle", "More stories: title"),
      F.i18n("moreLabel", "More stories: button"),
      F.i18n("sourceNote", "Old blog: note", { multiline: true }),
      F.i18n("sourceLink", "Old blog: link text"),
    ],
  },
  {
    key: "hero",
    label: "Featured story",
    description: "The big story at the top. It shows the newest story unless you pick one.",
    fields: [F.ref("featured", "Featured story", "posts", { help: "Leave empty to always feature the newest story." }), F.i18n("eyebrow", "Eyebrow"), F.i18n("buttonLabel", "Button")],
  },
  {
    key: "stories",
    label: "Story list",
    description: "The story cards with category filters and pages.",
    fields: [
      F.i18n("eyebrow", "Eyebrow"),
      F.i18n("title", "Title", { required: true }),
      F.i18n("lead", "Intro text", { multiline: true }),
      F.i18n("allLabel", "“All” filter button"),
      F.number("pageSize", "Stories per page", { min: 3, max: 48 }),
      F.i18n("cardLabel", "Card link text"),
    ],
  },
  {
    key: "cta",
    label: "Call to action",
    description: "The band at the bottom of the page.",
    fields: [
      F.i18n("title", "Title", { required: true }),
      F.i18n("text", "Text", { multiline: true }),
      F.i18n("primaryLabel", "First button"),
      F.url("primaryUrl", "First button link", "An Instagram link shows the Instagram icon."),
      F.i18n("secondaryLabel", "WhatsApp button"),
      F.text("secondaryMessage", "WhatsApp message"),
    ],
  },
];

export const BLOG_SCHEMAS = Object.fromEntries(BLOG_SECTIONS.map((s) => [s.key, schemaFor(s.fields)]));
