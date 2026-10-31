import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../env";
import * as schema from "./schema";

const g = globalThis as unknown as { __adaPool?: mysql.Pool };
/** One pool per process (kept across hot reloads in dev). */
const pool = g.__adaPool ?? (g.__adaPool = mysql.createPool({ uri: env.DATABASE_URL, connectionLimit: 10, timezone: "Z" }));

export const db = drizzle(pool, { schema, mode: "default" });
export { schema };
