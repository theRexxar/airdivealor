"use client";

import { EXACT, FRAG } from "./i18n-dict";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "EN" | "ID";

/** EN → ID strings added on top of the design dictionary (lib/i18n-dict.ts), from the page prototypes. */
const EXTRA: Record<string, string> = {
  // Header and footer
  Home: "Beranda",
  "Dive sites": "Titik selam",
  Pricing: "Harga",
  "Facilities and rates": "Fasilitas dan tarif",
  "Dive courses": "Kursus selam",
  "About us": "Tentang kami",
  Book: "Pesan",
  Explore: "Jelajahi",
  "Plan your trip": "Rencanakan perjalanan",
  "Follow us": "Ikuti kami",
  Prices: "Harga",
  FAQ: "Tanya jawab",
  "Safety policy": "Kebijakan keselamatan",
  "Cancellation policy": "Kebijakan pembatalan",
  Privacy: "Privasi",
  "Air DiveX, our sister brand": "Air DiveX, merek saudara kami",
  "© 2026 Air Dive Alor Team": "© 2026 Tim Air Dive Alor",
  "Alor Kecil, Alor Barat Laut, Alor Regency, East Nusa Tenggara, Indonesia":
    "Alor Kecil, Alor Barat Laut, Kabupaten Alor, Nusa Tenggara Timur, Indonesia",
  // Blog list
  "Read story": "Baca cerita",
  "Plan your dive": "Rencanakan penyelaman",
  All: "Semua",
  "Blog · Latest story": "Blog · Cerita terbaru",
  "Read the story": "Baca ceritanya",
  Stories: "Cerita",
  "Stories from Alor Kecil.": "Cerita dari Alor Kecil.",
  "News from the dive center, the reef and the village, written by our team.":
    "Kabar dari dive center, terumbu karang, dan desa, ditulis oleh tim kami.",
  "Follow our dives.": "Ikuti penyelaman kami.",
  "More photos and videos from Alor, from our team and our guests.":
    "Lebih banyak foto dan video dari Alor, dari tim dan tamu kami.",
  "Follow on Instagram": "Ikuti di Instagram",
  Previous: "Sebelumnya",
  Next: "Berikutnya",
  Pagination: "Halaman",
  // Story page
  "Share on WhatsApp": "Bagikan lewat WhatsApp",
  "Copy link": "Salin tautan",
  "Link copied": "Tautan disalin",
  "Share this story": "Bagikan cerita ini",
  "Older story": "Cerita sebelumnya",
  "Newer story": "Cerita berikutnya",
  "More stories": "Cerita lainnya",
  "See all stories": "Lihat semua cerita",
  "Want to see it for yourself?": "Ingin melihatnya sendiri?",
  "Tell us your dates. We will plan the dives and the stay.":
    "Beri tahu kami tanggal Anda. Kami akan atur penyelaman dan tempat menginap.",
  "We are still moving this story from our old blog.": "Cerita ini masih kami pindahkan dari blog lama kami.",
  "Read the full story on airdivealor.com": "Baca cerita lengkap di airdivealor.com",
  Breadcrumb: "Navigasi",
};

const ID: Record<string, string> = { ...EXACT, ...EXTRA };
const FRAG_RE = FRAG.map(([en, id]) => [new RegExp("\\b" + en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g"), id] as const);

/** Translate to Indonesian: exact match first, then word-level fragments (same rules as the prototypes). */
export function toId(en: string): string {
  const hit = ID[en];
  if (hit != null) return hit;
  let out = en;
  for (const [re, id] of FRAG_RE) out = out.replace(re, id);
  return out;
}

const STORAGE_KEY = "ada-lang";

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  /** Translate a fixed UI string. */
  t: (en: string) => string;
  /** Pick between an English and an Indonesian value. */
  pick: <T>(en: T, id: T | undefined) => T;
}

const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("EN");

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "ID") setLang("ID");
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "ID" ? "id" : "en";
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((l) => {
      const next: Lang = l === "EN" ? "ID" : "EN";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const t = useCallback((en: string) => (lang === "ID" ? toId(en) : en), [lang]);
  const pick = useCallback(<T,>(en: T, id: T | undefined) => (lang === "ID" && id != null ? id : en), [lang]);

  return <Ctx.Provider value={{ lang, toggle, t, pick }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useLang must be used inside <LangProvider>");
  return v;
}
