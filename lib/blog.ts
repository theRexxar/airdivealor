import type { Lang } from "./i18n";

/** Blog helpers. Stories, categories and blog texts live in the CMS; lib/blog-data.ts is only the source of the built-in defaults. */

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTHS_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function dateLabel(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  return lang === "ID" ? `${d} ${MONTHS_ID[m - 1]} ${y}` : `${MONTHS_EN[m - 1]} ${d}, ${y}`;
}

export const readTimeLabel = (minutes: number, lang: Lang) => (lang === "ID" ? `${minutes} menit baca` : `${minutes} min read`);

export const postHref = (slug: string) => `/blog/${slug}`;
