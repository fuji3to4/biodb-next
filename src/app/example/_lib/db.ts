import { Pool } from "pg";

const {
  BIODB_DB_HOST = "127.0.0.1",
  BIODB_DB_USER = "user",
  BIODB_DB_PASSWORD = "password",
  BIODB_DB_NAME_EXAMPLE = "demo",
  BIODB_DB_PORT,
} = process.env;

function getDbPort(): number {
  if (!BIODB_DB_PORT) return 5432;
  const parsed = Number(BIODB_DB_PORT);
  return Number.isFinite(parsed) ? parsed : 5432;
}

declare global {
  // eslint-disable-next-line no-var
  var __biodbPool: Pool | undefined;
}

export function getPool(): Pool {
  if (globalThis.__biodbPool) return globalThis.__biodbPool;

  const pool = new Pool({
    host: BIODB_DB_HOST,
    user: BIODB_DB_USER,
    password: BIODB_DB_PASSWORD,
    database: BIODB_DB_NAME_EXAMPLE,
    port: getDbPort(),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__biodbPool = pool;
  }

  return pool;
}

export {};
