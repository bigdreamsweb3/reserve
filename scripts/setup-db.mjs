import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const schemaPath = resolve(process.cwd(), "db", "schema.sql");
const sql = await readFile(schemaPath, "utf8");
const pool = new Pool({ connectionString: databaseUrl });

try {
  await pool.query(sql);
  console.log("Database schema applied successfully.");
} finally {
  await pool.end();
}
