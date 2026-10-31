import { inArray } from "drizzle-orm";
import { sectionEditPermission } from "@/lib/cms/permissions";
import { can } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { handle, ok, requireUser } from "@/lib/server/http";
import { hasChanges, pageSections, requirePageDef } from "@/lib/server/page-service";

type Ctx = { params: Promise<{ slug: string }> };

/** Section list for a page: order, visibility, unpublished changes and who changed what. */
export const GET = handle(async (_req, ctx: Ctx) => {
  const { slug } = await ctx.params;
  const def = requirePageDef(slug);
  const me = await requireUser(`${slug}.view`);
  const rows = await pageSections(slug);
  const userIds = [...new Set(rows.flatMap((r) => [r.draftUpdatedBy, r.publishedBy]).filter((x): x is number => !!x))];
  const people = userIds.length ? await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(inArray(schema.users.id, userIds)) : [];
  const nameOf = (id: number | null) => people.find((p) => p.id === id)?.name ?? null;
  return ok({
    page: { slug: def.slug, label: def.label, href: def.href },
    sections: rows.flatMap((r) => {
      const s = def.sections.find((d) => d.key === r.key);
      if (!s) return [];
      return [{
        key: r.key,
        label: s.label,
        description: s.description,
        depth: s.depth ?? null,
        fixed: !!s.fixed,
        enabled: r.enabled,
        hasChanges: hasChanges(r),
        draftUpdatedAt: r.draftUpdatedAt,
        draftUpdatedBy: nameOf(r.draftUpdatedBy),
        publishedAt: r.publishedAt,
        publishedBy: nameOf(r.publishedBy),
        canEdit: can(me, sectionEditPermission(slug, r.key)),
      }];
    }),
    canPublish: can(me, `${slug}.publish`),
    canLayout: can(me, `${slug}.layout`),
  });
});
