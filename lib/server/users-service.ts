import { desc, eq, inArray } from "drizzle-orm";
import { db, schema } from "./db";

/** Users with their roles, newest first. */
export async function listUsers() {
  const us = await db.select().from(schema.users).orderBy(desc(schema.users.createdAt));
  const links = us.length
    ? await db
        .select({ userId: schema.userRoles.userId, id: schema.roles.id, name: schema.roles.name })
        .from(schema.userRoles)
        .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
        .where(inArray(schema.userRoles.userId, us.map((u) => u.id)))
    : [];
  return us.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    status: u.status,
    lastLoginAt: u.lastLoginAt,
    createdAt: u.createdAt,
    roles: links.filter((l) => l.userId === u.id).map(({ id, name }) => ({ id, name })),
  }));
}

export async function setUserRoles(userId: number, roleIds: number[]) {
  await db.delete(schema.userRoles).where(eq(schema.userRoles.userId, userId));
  if (roleIds.length) await db.insert(schema.userRoles).values(roleIds.map((roleId) => ({ userId, roleId })));
}

/** Number of active users holding a system (Super admin) role, used to stop the last one being removed. */
export async function activeSuperAdmins(): Promise<number[]> {
  const rows = await db
    .select({ id: schema.users.id, status: schema.users.status })
    .from(schema.userRoles)
    .innerJoin(schema.roles, eq(schema.userRoles.roleId, schema.roles.id))
    .innerJoin(schema.users, eq(schema.userRoles.userId, schema.users.id))
    .where(eq(schema.roles.isSystem, true));
  return [...new Set(rows.filter((r) => r.status === "active").map((r) => r.id))];
}
