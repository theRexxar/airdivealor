import { eq } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { listRoles, roleInput, setRolePermissions } from "@/lib/server/roles-service";

export const GET = handle(async () => {
  await requireUser("users.view");
  return ok({ roles: await listRoles() });
});

export const POST = handle(async (req) => {
  const me = await requireUser("roles.manage");
  const data = await body(req, roleInput);
  if (await db.query.roles.findFirst({ where: eq(schema.roles.name, data.name) })) throw new HttpError(409, "A role with this name already exists.", [{ path: ["name"], message: "Already in use." }]);
  const [res] = await db.insert(schema.roles).values({ name: data.name, description: data.description });
  await setRolePermissions(res.insertId, data.permissions);
  await audit(me.id, "role.created", data.name, { permissions: data.permissions.length });
  return ok({ id: res.insertId }, 201);
});
