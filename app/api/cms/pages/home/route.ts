import { HOME_SECTIONS } from "@/lib/cms/home-sections";
import { sectionEditPermission } from "@/lib/cms/permissions";
import { can } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { inArray } from "drizzle-orm";
import { hasChanges, homeSections } from "@/lib/server/home-service";
import { handle, ok, requireUser } from "@/lib/server/http";

/** Section list for the Home page editor: order, visibility, unpublished changes and who changed what. */
export const GET = handle(async () => {
  const me = await requireUser("home.view");
  const rows = await homeSections();
  const userIds = [...new Set(rows.flatMap((r) => [r.draftUpdatedBy, r.publishedBy]).filter((x): x is number => !!x))];
  const people = userIds.length ? await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(inArray(schema.users.id, userIds)) : [];
  const nameOf = (id: number | null) => people.find((p) => p.id === id)?.name ?? null;
  return ok({
    sections: rows.map((r) => {
      const def = HOME_SECTIONS.find((d) => d.key === r.key)!;
      return {
        key: r.key,
        label: def?.label ?? r.key,
        description: def?.description ?? "",
        depth: def?.depth ?? null,
        fixed: !!def?.fixed,
        enabled: r.enabled,
        hasChanges: hasChanges(r),
        draftUpdatedAt: r.draftUpdatedAt,
        draftUpdatedBy: nameOf(r.draftUpdatedBy),
        publishedAt: r.publishedAt,
        publishedBy: nameOf(r.publishedBy),
        canEdit: can(me, sectionEditPermission(r.key)),
      };
    }),
    canPublish: can(me, "home.publish"),
    canLayout: can(me, "home.layout"),
  });
});
