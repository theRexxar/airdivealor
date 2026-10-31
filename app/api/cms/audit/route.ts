import { desc, eq, lt } from "drizzle-orm";
import { db, schema } from "@/lib/server/db";
import { handle, ok, requireUser } from "@/lib/server/http";

/** Activity log, newest first, 50 per page (pass ?before=<id> for the next page). */
export const GET = handle(async (req) => {
  await requireUser("audit.view");
  const before = Number(new URL(req.url).searchParams.get("before")) || 0;
  const rows = await db
    .select({ id: schema.auditLogs.id, action: schema.auditLogs.action, target: schema.auditLogs.target, meta: schema.auditLogs.meta, ip: schema.auditLogs.ip, createdAt: schema.auditLogs.createdAt, user: schema.users.name, email: schema.users.email })
    .from(schema.auditLogs)
    .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id))
    .where(before ? lt(schema.auditLogs.id, before) : undefined)
    .orderBy(desc(schema.auditLogs.id))
    .limit(50);
  return ok({ entries: rows, next: rows.length === 50 ? rows[rows.length - 1].id : null });
});
