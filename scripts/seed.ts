/**
 * Seed the CMS (safe to run again): roles and permissions, the first Super admin, the Home page
 * with its sections, and the local Home photos imported into the media library.
 * Usage: npm run cms:seed
 */
import { and, eq } from "drizzle-orm";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { HOME_DEFAULTS } from "../lib/cms/home-defaults";
import { HOME_SECTIONS } from "../lib/cms/home-sections";
import { DEFAULT_ROLES, PERMISSION_KEYS } from "../lib/cms/permissions";
import { db, schema } from "../lib/server/db";
import { env } from "../lib/server/env";
import { enqueueMedia, mediaQueue } from "../lib/server/queue";
import { ensureBucket, putObject } from "../lib/server/storage";
import bcrypt from "bcryptjs";

const MIME: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png" };

async function seedRoles() {
  for (const r of DEFAULT_ROLES) {
    let role = await db.query.roles.findFirst({ where: eq(schema.roles.name, r.name) });
    if (!role) {
      const [res] = await db.insert(schema.roles).values({ name: r.name, description: r.description, isSystem: !!r.system });
      role = (await db.query.roles.findFirst({ where: eq(schema.roles.id, res.insertId) }))!;
      const perms = r.permissions === "all" ? PERMISSION_KEYS : r.permissions;
      if (perms.length) await db.insert(schema.rolePermissions).values(perms.map((permission) => ({ roleId: role!.id, permission })));
      console.info(`role: ${r.name}`);
    }
  }
}

async function seedAdmin() {
  const email = env.SEED_ADMIN_EMAIL.toLowerCase();
  if (await db.query.users.findFirst({ where: eq(schema.users.email, email) })) return;
  if (!env.SEED_ADMIN_PASSWORD) throw new Error("Set SEED_ADMIN_PASSWORD to create the first admin.");
  const [res] = await db.insert(schema.users).values({ email, name: "Administrator", passwordHash: await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 12), status: "active" });
  const role = await db.query.roles.findFirst({ where: eq(schema.roles.name, "Super admin") });
  await db.insert(schema.userRoles).values({ userId: res.insertId, roleId: role!.id });
  console.info(`admin: ${email}`);
}

/** Upload a local public/ file as a media item and queue it for processing. Returns the media id. */
async function importLocal(url: string, cache: Map<string, number>): Promise<number | null> {
  if (!url.startsWith("/")) return null;
  if (cache.has(url)) return cache.get(url)!;
  const mime = MIME[extname(url).toLowerCase()];
  if (!mime) return null;
  const bytes = await readFile(join(process.cwd(), "public", url));
  const name = url.split("/").pop()!;
  const [res] = await db.insert(schema.media).values({ kind: "image", status: "processing", originalKey: "pending", originalName: name, mime, size: bytes.length });
  const key = `originals/${res.insertId}/${name}`;
  await putObject(key, bytes, mime);
  await db.update(schema.media).set({ originalKey: key }).where(eq(schema.media.id, res.insertId));
  await enqueueMedia(res.insertId);
  cache.set(url, res.insertId);
  console.info(`media ${res.insertId}: ${url}`);
  return res.insertId;
}

/** Walk section content and swap local image URLs for media library ids. */
async function importMedia(value: unknown, cache: Map<string, number>): Promise<unknown> {
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) out.push(await importMedia(v, cache)); // one at a time, so a photo used twice is imported once
    return out;
  }
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if ("mediaId" in o && "url" in o && typeof o.url === "string") {
      const id = await importLocal(o.url, cache);
      return id ? { mediaId: id, url: "" } : o;
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) out[k] = await importMedia(v, cache);
    return out;
  }
  return value;
}

async function seedHome() {
  let page = await db.query.pages.findFirst({ where: eq(schema.pages.slug, "home") });
  if (!page) {
    const [res] = await db.insert(schema.pages).values({ slug: "home", title: "Home" });
    page = (await db.query.pages.findFirst({ where: eq(schema.pages.id, res.insertId) }))!;
  }
  const cache = new Map<string, number>();
  let i = 0;
  for (const s of HOME_SECTIONS) {
    i++;
    const exists = await db.query.pageSections.findFirst({ where: and(eq(schema.pageSections.pageId, page.id), eq(schema.pageSections.key, s.key)) });
    if (exists) continue;
    const content = await importMedia((HOME_DEFAULTS as unknown as Record<string, unknown>)[s.key], cache);
    const now = new Date();
    await db.insert(schema.pageSections).values({ pageId: page.id, key: s.key, sort: i * 10, enabled: true, draft: content, published: content, draftUpdatedAt: now, publishedAt: now });
    console.info(`section: ${s.key}`);
  }
}

async function main() {
  await ensureBucket();
  await seedRoles();
  await seedAdmin();
  await seedHome();
  await mediaQueue().close();
  console.info("seed done");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
