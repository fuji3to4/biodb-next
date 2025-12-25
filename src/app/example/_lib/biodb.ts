import { getPool } from "./db";
import bcrypt from "bcrypt";

export type SearchRow = {
  pdbID: string;
  method: string | null;
  resolution: number | null;
  class: string | null;
  name: string | null;
  organism: string | null;
};

export type PdbDetailRow = {
  pdbID: string;
  method: string | null;
  resolution: number | null;
  chain: string | null;
  positions: string | null;
  deposited: string | null;
  class: string | null;
  url: string | null;
  name: string | null;
  organism: string | null;
  len: number | null;
};

function likeValue(value: string | undefined): string {
  return `%${value ?? ""}%`;
}

function parseOptionalNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

function formatDateYmd(value: unknown): string | null {
  if (value == null) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string") {
    // MySQL drivers sometimes return DATE as string (YYYY-MM-DD)
    return value.slice(0, 10);
  }

  return String(value);
}

export async function searchPdb(params: {
  id?: string;
  name?: string;
  class?: string;
  org?: string;
  res?: string;
}): Promise<SearchRow[]> {
  const pool = getPool();

  const idLike = likeValue(params.id);
  const classLike = likeValue(params.class);
  const nameLike = likeValue(params.name);
  const orgLike = likeValue(params.org);
  const resNum = parseOptionalNumber(params.res);

  let sql = `
    select PDB.pdbID, PDB.method, PDB.resolution, PDB.class, Protein.name, Protein.organism
    from PDB natural join PDB2Protein natural join Protein
    where (PDB.pdbID like $1)
      and (PDB.class like $2)
      and (Protein.name like $3)
      and (Protein.organism like $4)
  `;

  const values: Array<string | number> = [idLike, classLike, nameLike, orgLike];

  if (resNum !== null) {
    sql += ` and (PDB.resolution <= $5)`;
    values.push(resNum);
  }

  const result = await pool.query(sql, values);
  return result.rows.map((r: any) => ({
    pdbID: String(r.pdbid),
    method: r.method ?? null,
    resolution: r.resolution === null ? null : Number(r.resolution),
    class: r.class ?? null,
    name: r.name ?? null,
    organism: r.organism ?? null,
  }));
}

export async function getPdbDetail(pdbID: string): Promise<PdbDetailRow | null> {
  const pool = getPool();

  const sql = `
    select PDB.pdbID, PDB.method, PDB.resolution, PDB.chain, PDB.positions, PDB.deposited,
           PDB.class, PDB.url, Protein.name, Protein.organism, Protein.len
    from PDB natural join PDB2Protein natural join Protein
    where PDB.pdbID = $1
    limit 1
  `;

  const result = await pool.query(sql, [pdbID]);
  if (!result.rows.length) return null;

  const r = result.rows[0];
  return {
    pdbID: String(r.pdbid),
    method: r.method ?? null,
    resolution: r.resolution === null ? null : Number(r.resolution),
    chain: r.chain ?? null,
    positions: r.positions ?? null,
    deposited: formatDateYmd(r.deposited),
    class: r.class ?? null,
    url: r.url ?? null,
    name: r.name ?? null,
    organism: r.organism ?? null,
    len: r.len === null ? null : Number(r.len),
  };
}

export async function verifyUser(username: string, password: string): Promise<{ id: number; username: string } | null> {
  const pool = getPool();

  const sql = `
    SELECT id, username, password
    FROM Users
    WHERE username = $1
    LIMIT 1
  `;

  const result = await pool.query(sql, [username]);
  if (!result.rows.length) {
    return null;
  }

  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, String(user.password));
  
  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function saveUser(username: string, hashedPassword: string): Promise<{ id: number; username: string }> {
  const pool = getPool();

  const sql = `
    INSERT INTO Users (username, password)
    VALUES ($1, $2)
    RETURNING id, username
  `;

  const result = await pool.query(sql, [username, hashedPassword]);
  return result.rows[0];
}
