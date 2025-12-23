import mysql from "mysql2/promise";

const {
  BIODB_DB_HOST = "127.0.0.1",
  BIODB_DB_USER = "user",
  BIODB_DB_PASSWORD = "password",
  BIODB_DB_NAME_EXAMPLE = "demo",
  BIODB_DB_PORT,
} = process.env;

function getDbPort(): number {
  if (!BIODB_DB_PORT) return 3306;
  const parsed = Number(BIODB_DB_PORT);
  return Number.isFinite(parsed) ? parsed : 3306;
}

declare global {
  // eslint-disable-next-line no-var
  var __biodbPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (globalThis.__biodbPool) return globalThis.__biodbPool;

  const pool = mysql.createPool({
    host: BIODB_DB_HOST,
    user: BIODB_DB_USER,
    password: BIODB_DB_PASSWORD,
    database: BIODB_DB_NAME_EXAMPLE,
    port: getDbPort(),
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__biodbPool = pool;
  }

  return pool;
}

export {};
