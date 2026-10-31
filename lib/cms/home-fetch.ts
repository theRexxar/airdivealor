import { headers } from "next/headers";
import { HOME_DEFAULTS } from "./home-defaults";
import type { PublishedHome } from "./home-types";

/** Cache tag shared with the CMS: publishing calls revalidateTag on it. */
export const HOME_TAG = "cms:home";

/** Where the website reaches the CMS API. Defaults to this same app. */
async function apiBase() {
  if (process.env.CMS_API_URL) return process.env.CMS_API_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Content used when the CMS can't be reached: the built-in defaults (same as the first seed). */
export const FALLBACK_HOME: PublishedHome = {
  content: HOME_DEFAULTS,
  order: ["awards", "prices", "why", "sites", "stay", "reviews", "faq", "book"],
  media: {},
  publishedAt: null,
};

/**
 * Published Home content from the CMS API (GET /api/public/pages/home), cached for 5 minutes and
 * refreshed immediately when an editor publishes. Falls back to the defaults if the API is down.
 */
export async function getHome(): Promise<{ data: PublishedHome; fromCms: boolean }> {
  try {
    const res = await fetch(`${await apiBase()}/api/public/pages/home`, { cache: "force-cache", next: { revalidate: 300, tags: [HOME_TAG] }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`CMS API answered ${res.status}`);
    return { data: (await res.json()) as PublishedHome, fromCms: true };
  } catch (e) {
    console.error("[home] using fallback content:", e instanceof Error ? e.message : e);
    return { data: FALLBACK_HOME, fromCms: false };
  }
}
