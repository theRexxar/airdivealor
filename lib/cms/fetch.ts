import { headers } from "next/headers";
import { DIVE_SITES_DEFAULTS, SITES_DEFAULTS } from "./dive-sites-defaults";
import type { PublishedDiveSites, PublishedSite } from "./dive-sites-types";
import { HOME_DEFAULTS } from "./home-defaults";
import type { PublishedHome } from "./home-types";
import { collectionTag, pageTag } from "./tags";

/** Where the website reaches the CMS API. Defaults to this same app. */
async function apiBase() {
  if (process.env.CMS_API_URL) return process.env.CMS_API_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * GET a public CMS endpoint, cached for 5 minutes and refreshed the moment an editor publishes
 * (the CMS expires these tags). Returns null on 404; throws if the CMS can't be reached.
 */
async function cmsGet<T>(path: string, tags: string[]): Promise<T | null> {
  const res = await fetch(`${await apiBase()}${path}`, { cache: "force-cache", next: { revalidate: 300, tags }, signal: AbortSignal.timeout(5000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`CMS API answered ${res.status}`);
  return (await res.json()) as T;
}

const warn = (what: string, e: unknown) => console.error(`[cms] ${what}: using built-in content (${e instanceof Error ? e.message : e})`);

export const FALLBACK_HOME: PublishedHome = {
  content: HOME_DEFAULTS,
  order: ["awards", "prices", "why", "sites", "stay", "reviews", "faq", "book"],
  media: {},
  sites: Object.fromEntries(SITES_DEFAULTS.map((s) => [s.slug, s])),
  publishedAt: null,
};

export const FALLBACK_DIVE_SITES: PublishedDiveSites = {
  content: DIVE_SITES_DEFAULTS,
  order: ["hero", "highlights", "list", "cta"],
  sites: SITES_DEFAULTS,
  media: {},
  publishedAt: null,
};

export async function getHome(): Promise<PublishedHome> {
  try {
    return (await cmsGet<PublishedHome>("/api/public/pages/home", [pageTag("home"), collectionTag("sites")])) ?? FALLBACK_HOME;
  } catch (e) {
    warn("home", e);
    return FALLBACK_HOME;
  }
}

export async function getDiveSites(): Promise<PublishedDiveSites> {
  try {
    return (await cmsGet<PublishedDiveSites>("/api/public/pages/dive-sites", [pageTag("dive-sites"), collectionTag("sites")])) ?? FALLBACK_DIVE_SITES;
  } catch (e) {
    warn("dive sites", e);
    return FALLBACK_DIVE_SITES;
  }
}

/** One site guide, or null when the site isn't published (the page then shows 404). */
export async function getSite(slug: string): Promise<PublishedSite | null> {
  try {
    return await cmsGet<PublishedSite>(`/api/public/sites/${encodeURIComponent(slug)}`, [pageTag("dive-sites"), collectionTag("sites")]);
  } catch (e) {
    warn(`site ${slug}`, e);
    const i = SITES_DEFAULTS.findIndex((s) => s.slug === slug);
    if (i < 0) return null;
    const n = SITES_DEFAULTS.length;
    const prev = SITES_DEFAULTS[(i + n - 1) % n];
    const next = SITES_DEFAULTS[(i + 1) % n];
    return { site: SITES_DEFAULTS[i], index: i, total: n, prev: { slug: prev.slug, name: prev.name }, next: { slug: next.slug, name: next.name }, guide: DIVE_SITES_DEFAULTS.guide, media: {} };
  }
}
