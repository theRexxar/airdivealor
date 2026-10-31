import { SITES } from "./sites-data";
import type { Site } from "./sites-types";

export { SITES };
export type { Site };

export const siteHref = (slug: string) => `/dive-sites/${slug}`;
export const siteNum = (i: number) => String(i + 1).padStart(2, "0");

export type SiteFilter = "all" | "wall" | "muck" | "reef" | "drift" | "cave";
export const SITE_FILTERS: [SiteFilter, string, (s: Site) => boolean][] = [
  ["all", "All", () => true],
  ["wall", "Walls", (s) => s.diveTypes.some((t) => /Wall|Drop-off/.test(t))],
  ["muck", "Muck and macro", (s) => s.diveTypes.some((t) => /Muck|Macro/.test(t))],
  ["reef", "Reefs and slopes", (s) => s.diveTypes.some((t) => /Reef|slope/i.test(t))],
  ["drift", "Pinnacles and drift", (s) => s.diveTypes.some((t) => /Pinnacle|Drift|Blue/.test(t))],
  ["cave", "Caves", (s) => s.diveTypes.some((t) => /Cave|Swim/.test(t))],
];
