import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export function hasDatabaseUrl() {
  return Boolean(databaseUrl && databaseUrl.trim().length > 0);
}

export function getSql() {
  if (!databaseUrl || !databaseUrl.trim()) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}
