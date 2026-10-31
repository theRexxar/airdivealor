"use client";

import type { I18n, MediaRef } from "./fields";
import type { ResolvedMedia } from "./home-types";
import { useLang } from "../i18n";

/** Language and media helpers for pages rendered from CMS content. */
export function useContent(media: Record<string, ResolvedMedia>) {
  const { lang, t } = useLang();
  /** The visitor's language; English when the Indonesian text is empty. */
  const L = (v: I18n | undefined) => (v ? (lang === "ID" && v.id.trim() ? v.id : v.en) : "");
  /** Image props for a media reference: responsive WebP from the library, or the external URL. */
  const img = (ref: MediaRef | undefined, sizes = "100vw") => {
    if (!ref) return null;
    const m = ref.mediaId ? media[ref.mediaId] : null;
    if (m) return { src: m.url, srcSet: m.srcSet || undefined, sizes: m.srcSet ? sizes : undefined, alt: L(m.alt), poster: m.poster };
    return ref.url ? { src: ref.url, srcSet: undefined, sizes: undefined, alt: "", poster: undefined } : null;
  };
  return { L, img, t, lang };
}
export type ContentHelpers = ReturnType<typeof useContent>;
