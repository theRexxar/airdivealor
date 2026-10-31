import type { PublishedAbout } from "@/lib/cms/about-types";
import type { CourseContent, PublishedCourse, PublishedCourses } from "@/lib/cms/courses-types";
import type { PublishedDiveSites, PublishedSite, SiteContent } from "@/lib/cms/dive-sites-types";
import type { PublishedFacilities } from "@/lib/cms/facilities-types";
import type { HomeContent, PublishedHome } from "@/lib/cms/home-types";
import { liveItems } from "./collection-service";
import { HttpError } from "./http";
import { resolveMedia } from "./media-service";
import { pageContent } from "./page-service";

type Opts = { draft?: boolean };

/** Home: page content plus the dive sites its site picker refers to. */
async function homePayload(opts: Opts): Promise<PublishedHome> {
  const page = await pageContent("home", opts);
  const content = page.content as unknown as HomeContent;
  const { items } = await liveItems<SiteContent>("sites", opts);
  const wanted = new Set(content.sites.items.map((x) => x.slug));
  const sites = Object.fromEntries(items.filter((x) => wanted.has(x.slug)).map((x) => [x.slug, x]));
  // Only resolve media of the picked sites.
  const ids = new Set(page.mediaIds);
  for (const x of Object.values(sites)) {
    if (x.photo.mediaId) ids.add(x.photo.mediaId);
  }
  return { content, order: page.order as PublishedHome["order"], media: await resolveMedia(ids), sites, publishedAt: page.publishedAt };
}

/** Dive sites page: page content plus every published, visible site in order. */
async function diveSitesPayload(opts: Opts): Promise<PublishedDiveSites> {
  const page = await pageContent("dive-sites", opts);
  const { items, mediaIds } = await liveItems<SiteContent>("sites", opts);
  return {
    content: page.content as unknown as PublishedDiveSites["content"],
    order: page.order,
    sites: items,
    media: await resolveMedia(new Set([...page.mediaIds, ...mediaIds])),
    publishedAt: page.publishedAt,
  };
}

/** Dive courses page: page content plus every published, visible course in order. */
async function coursesPayload(opts: Opts): Promise<PublishedCourses> {
  const page = await pageContent("dive-courses", opts);
  const { items, mediaIds } = await liveItems<CourseContent>("courses", opts);
  return {
    content: page.content as unknown as PublishedCourses["content"],
    order: page.order,
    courses: items,
    media: await resolveMedia(new Set([...page.mediaIds, ...mediaIds])),
    publishedAt: page.publishedAt,
  };
}

/** A page that is only its own sections (no collection items). */
async function plainPayload(slug: string, opts: Opts) {
  const page = await pageContent(slug, opts);
  return { content: page.content, order: page.order, media: await resolveMedia(new Set(page.mediaIds)), publishedAt: page.publishedAt };
}

export async function publicPagePayload(slug: string, opts: Opts = {}) {
  if (slug === "home") return homePayload(opts);
  if (slug === "dive-sites") return diveSitesPayload(opts);
  if (slug === "dive-courses") return coursesPayload(opts);
  if (slug === "about-us") return (await plainPayload(slug, opts)) as unknown as PublishedAbout;
  if (slug === "facilities") return (await plainPayload(slug, opts)) as unknown as PublishedFacilities;
  throw new HttpError(404, "Unknown page.");
}

/** One site guide with shared guide texts and previous/next neighbours. Null when not published or hidden. */
export async function publicSitePayload(slug: string, opts: Opts = {}): Promise<PublishedSite | null> {
  const { items } = await liveItems<SiteContent>("sites", opts);
  const i = items.findIndex((x) => x.slug === slug);
  if (i < 0) return null;
  const site = items[i];
  const n = items.length;
  const page = await pageContent("dive-sites", opts);
  const ids = new Set<number>();
  if (site.photo.mediaId) ids.add(site.photo.mediaId);
  site.gallery.forEach((g) => g.photo.mediaId && ids.add(g.photo.mediaId));
  const prev = items[(i + n - 1) % n];
  const next = items[(i + 1) % n];
  return {
    site,
    index: i,
    total: n,
    prev: { slug: prev.slug, name: prev.name },
    next: { slug: next.slug, name: next.name },
    guide: (page.content as unknown as PublishedDiveSites["content"]).guide,
    media: await resolveMedia(ids),
  };
}

/** One course page with the shared course-page texts and previous/next neighbours. Null when not published or hidden. */
export async function publicCoursePayload(slug: string, opts: Opts = {}): Promise<PublishedCourse | null> {
  const { items } = await liveItems<CourseContent>("courses", opts);
  const i = items.findIndex((x) => x.slug === slug);
  if (i < 0) return null;
  const course = items[i];
  const n = items.length;
  const page = await pageContent("dive-courses", opts);
  const prev = items[(i + n - 1) % n];
  const next = items[(i + 1) % n];
  return {
    course,
    index: i,
    total: n,
    prev: { slug: prev.slug, name: prev.name },
    next: { slug: next.slug, name: next.name },
    detail: (page.content as unknown as PublishedCourses["content"]).detail,
    media: await resolveMedia(new Set(course.photo.mediaId ? [course.photo.mediaId] : [])),
  };
}

/** The public payload of one collection item, as its page on the website uses it. */
export async function publicItemPayload(collection: string, slug: string, opts: Opts = {}) {
  if (collection === "sites") return publicSitePayload(slug, opts);
  if (collection === "courses") return publicCoursePayload(slug, opts);
  throw new HttpError(404, "No public page for this collection.");
}
