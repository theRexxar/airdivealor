import { and, asc, eq, ne } from "drizzle-orm";
import { collectMediaIds } from "@/lib/cms/fields";
import { collectionDef } from "@/lib/cms/registry";
import { schemaFor } from "@/lib/cms/fields";
import { db, schema } from "./db";
import { HttpError } from "./http";

export type ItemRow = typeof schema.collectionItems.$inferSelect;

export function requireCollection(key: string) {
  const def = collectionDef(key);
  if (!def) throw new HttpError(404, "Unknown collection.");
  return def;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Validate item content with the collection's fields, plus a clean, unique web address. */
export async function validateItem(key: string, content: unknown, selfId?: number) {
  const def = requireCollection(key);
  const r = schemaFor(def.fields).safeParse(content);
  if (!r.success) throw new HttpError(422, "Please check the highlighted fields.", r.error.issues.map((i) => ({ path: i.path, message: i.message })));
  const data = r.data as Record<string, unknown> & { slug: string };
  if (!SLUG_RE.test(data.slug)) throw new HttpError(422, "Use lowercase letters, numbers and dashes only.", [{ path: ["slug"], message: "Use lowercase letters, numbers and dashes only, e.g. kals-dream." }]);
  const clash = await db.query.collectionItems.findFirst({
    where: and(eq(schema.collectionItems.collection, key), eq(schema.collectionItems.slug, data.slug), selfId ? ne(schema.collectionItems.id, selfId) : undefined),
  });
  if (clash) throw new HttpError(409, "Another item already uses this web address.", [{ path: ["slug"], message: "Already used by another item." }]);
  return data;
}

export async function listItems(key: string) {
  requireCollection(key);
  return db.select().from(schema.collectionItems).where(eq(schema.collectionItems.collection, key)).orderBy(asc(schema.collectionItems.sort), asc(schema.collectionItems.id));
}

export async function getItem(key: string, id: number) {
  requireCollection(key);
  const row = await db.query.collectionItems.findFirst({ where: and(eq(schema.collectionItems.collection, key), eq(schema.collectionItems.id, id)) });
  if (!row) throw new HttpError(404, "Item not found.");
  return row;
}

/** Item status for the CMS list. */
export function itemStatus(r: ItemRow): "draft" | "live" | "changed" | "hidden" {
  if (!r.published) return "draft";
  if (!r.enabled) return "hidden";
  return JSON.stringify(r.draft) !== JSON.stringify(r.published) ? "changed" : "live";
}

/** Published, visible items in order (what the website shows). With draft: true, every item's draft (CMS preview). */
export async function liveItems<T = Record<string, unknown>>(key: string, opts: { draft?: boolean } = {}) {
  const def = requireCollection(key);
  const rows = await listItems(key);
  const items = rows.filter((r) => (opts.draft ? true : r.enabled && r.published)).map((r) => (opts.draft ? r.draft : r.published) as T);
  const mediaIds = new Set<number>();
  items.forEach((it) => collectMediaIds(def.fields, it, mediaIds));
  return { items, mediaIds };
}
