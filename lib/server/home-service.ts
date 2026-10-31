import { and, asc, eq } from "drizzle-orm";
import { collectMediaIds } from "@/lib/cms/fields";
import { HOME_DEFAULTS } from "@/lib/cms/home-defaults";
import { HOME_SECTIONS, sectionDef } from "@/lib/cms/home-sections";
import type { HomeContent, PublishedHome } from "@/lib/cms/home-types";
import { db, schema } from "./db";
import { HttpError } from "./http";
import { resolveMedia } from "./media-service";

export { HOME_TAG } from "@/lib/cms/home-fetch";

export async function homePage() {
  const page = await db.query.pages.findFirst({ where: eq(schema.pages.slug, "home") });
  if (!page) throw new HttpError(404, "The Home page has not been set up. Run npm run cms:seed.");
  return page;
}

export async function homeSections() {
  const page = await homePage();
  return db.select().from(schema.pageSections).where(eq(schema.pageSections.pageId, page.id)).orderBy(asc(schema.pageSections.sort));
}

export async function homeSection(key: string) {
  if (!sectionDef(key)) throw new HttpError(404, "Unknown section.");
  const page = await homePage();
  const row = await db.query.pageSections.findFirst({ where: and(eq(schema.pageSections.pageId, page.id), eq(schema.pageSections.key, key)) });
  if (!row) throw new HttpError(404, "Section not found. Run npm run cms:seed.");
  return row;
}

/** True when the draft differs from what is live. */
export const hasChanges = (r: { draft: unknown; published: unknown }) => JSON.stringify(r.draft) !== JSON.stringify(r.published);

/** Published Home content for the website, with media resolved to URLs. Draft = preview of unpublished changes. */
export async function publishedHome(opts: { draft?: boolean } = {}): Promise<PublishedHome> {
  const rows = await homeSections();
  const content = { ...HOME_DEFAULTS } as Record<string, unknown>;
  const ids = new Set<number>();
  let publishedAt: Date | null = null;
  const order: PublishedHome["order"] = [];
  for (const r of rows) {
    const def = sectionDef(r.key);
    if (!def) continue;
    const value = opts.draft ? r.draft : r.published;
    if (value) content[r.key] = value;
    collectMediaIds(def.fields, content[r.key], ids);
    if (r.publishedAt && (!publishedAt || r.publishedAt > publishedAt)) publishedAt = r.publishedAt;
    if (!def.fixed && r.enabled && (value || opts.draft)) order.push(r.key as PublishedHome["order"][number]);
  }
  return { content: content as unknown as HomeContent, order, media: await resolveMedia(ids), publishedAt: publishedAt?.toISOString() ?? null };
}

export const HOME_SECTION_ORDER = HOME_SECTIONS.filter((s) => !s.fixed).map((s) => s.key);
