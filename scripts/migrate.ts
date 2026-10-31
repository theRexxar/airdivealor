/** Apply database migrations from ./drizzle (npm run db:migrate). */
import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "../lib/server/db";

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => {
    console.info("migrations applied");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
