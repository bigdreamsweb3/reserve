import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const migrationPath = resolve(
  process.cwd(),
  "db",
  "migration_reserve_enhancements.sql",
);
const sql = await readFile(migrationPath, "utf8");
const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query(sql);
  console.log("Database migration applied successfully.");
} finally {
  await pool.end();
}
