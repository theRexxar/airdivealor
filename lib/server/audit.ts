import { db, schema } from "./db";
import { clientInfo } from "./auth";

/** Record who did what. Never throws: an audit failure must not break the action itself. */
export async function audit(userId: number | null, action: string, target = "", meta?: Record<string, unknown>) {
  try {
    const { ip } = await clientInfo();
    await db.insert(schema.auditLogs).values({ userId, action, target, meta: meta ?? null, ip });
  } catch (e) {
    console.error("audit failed", e);
  }
}
