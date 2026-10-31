import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { PERMISSION_KEYS } from "@/lib/cms/permissions";
import { db, schema } from "./db";

export async function listRoles() {
  const rs = await db.select().from(schema.roles).orderBy(asc(schema.roles.id));
  const perms = await db.select().from(schema.rolePermissions);
  const counts = await db.select({ roleId: schema.userRoles.roleId, n: sql<number>`count(*)` }).from(schema.userRoles).groupBy(schema.userRoles.roleId);
  return rs.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    isSystem: r.isSystem,
    permissions: r.isSystem ? PERMISSION_KEYS : perms.filter((p) => p.roleId === r.id).map((p) => p.permission),
    users: Number(counts.find((c) => c.roleId === r.id)?.n ?? 0),
  }));
}

export async function setRolePermissions(roleId: number, permissions: string[]) {
  await db.delete(schema.rolePermissions).where(eq(schema.rolePermissions.roleId, roleId));
  if (permissions.length) await db.insert(schema.rolePermissions).values(permissions.map((permission) => ({ roleId, permission })));
}

export const roleInput = z.object({
  name: z.string().trim().min(1, "Enter a role name.").max(60),
  description: z.string().trim().max(255).default(""),
  permissions: z.array(z.enum(PERMISSION_KEYS as [string, ...string[]])),
});
