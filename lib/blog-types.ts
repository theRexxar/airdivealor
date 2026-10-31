export type CategoryKey = "diving" | "marine" | "stay" | "community" | "team" | "boats";

export type Block =
  | { t: "p" | "h"; en: string; id: string }
  | { t: "img"; src: string; en?: string; id?: string }
  | { t: "gallery"; items: { src: string; en?: string; id?: string }[] }
  | { t: "list"; items: [en: string, id: string][] }
  | { t: "quote"; en: string; id: string; cite: string }
  | { t: "facts"; items: [labelEn: string, labelId: string, valueEn: string, valueId: string][] }
  | { t: "link"; en: string; id: string; href: string }
  | { t: "source"; href: string };

export interface Post {
  slug: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  cat: CategoryKey;
  /** [English name, Indonesian name, initials] */
  author: [string, string, string];
  cover: string;
  title: string;
  titleId: string;
  excerpt: string;
  excerptId: string;
  /** URL of the story on the old WordPress blog, for stories not migrated yet. */
  source?: string;
  body?: Block[];
}
