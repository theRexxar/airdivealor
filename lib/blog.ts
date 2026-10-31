import type { Lang } from "./i18n";
import type { Block, Post } from "./blog-types";
import { CATS, POSTS } from "./blog-data";

export { CATS, POSTS };
export type { Block, Post };

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function dateLabel(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return lang === "ID" ? `${d} ${MONTHS_ID[m - 1]} ${y}` : `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

/** Stories not migrated from the old blog yet show their excerpt plus a link to the original. */
export function bodyOf(p: Post): Block[] {
  if (p.body) return p.body;
  return [{ t: "p", en: p.excerpt, id: p.excerptId }, { t: "source", href: p.source ?? "" }];
}

function words(p: Post): number {
  let n = 0;
  for (const b of bodyOf(p)) {
    const s: string[] = ["en" in b && b.en ? b.en : ""];
    if ("items" in b) for (const i of b.items) s.push(Array.isArray(i) ? i.join(" ") : i.en ?? "");
    n += s.join(" ").split(/\s+/).length;
  }
  return n;
}

export function readTime(p: Post, lang: Lang): string {
  const m = Math.max(2, Math.round(words(p) / 200));
  return lang === "ID" ? `${m} menit baca` : `${m} min read`;
}

export const postHref = (slug: string) => `/blog/${slug}`;
export const bySlug = (slug: string) => POSTS.find((p) => p.slug === slug);
