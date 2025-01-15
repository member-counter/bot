import { join } from "path";
import { mongoMigrateCli } from "mongo-migrate-ts";

import { env } from "../env";

console.log(join(process.cwd(), "src", "migrations"));

mongoMigrateCli({
  uri: env.DATABASE_URL,
  migrationsDir: join(process.cwd(), "src", "migrations"),
  migrationsCollection: "migrations_changelog",
});
