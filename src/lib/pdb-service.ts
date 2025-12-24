import { query, getPool } from './db'

export interface PdbEntry {
  pdbid: string;
  method?: string | null;
  resolution?: number | null;
  class?: string | null;
  name?: string | null;
  organism?: string | null;
}

export const pdbService = {
  // Create/ensure nothing here: operate on existing demo schema (PDB, Protein, PDB2Protein)

  // Create a PDB and Protein association. Uses defaults for missing PDB fields.
  async createPdb(data: { pdb_id: string; protein_name: string }) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Ensure protein exists (match by name)
      const selProt = await client.query('SELECT proteinID FROM Protein WHERE name = $1 LIMIT 1', [data.protein_name]);
      let proteinID: number;
      if (selProt.rows.length) {
        proteinID = Number(selProt.rows[0].proteinid);
      } else {
        const insProt = await client.query(
          'INSERT INTO Protein (name, organism, len, fav) VALUES ($1, $2, $3, $4) RETURNING proteinID',
          [data.protein_name, 'Unknown', 0, 0]
        );
        proteinID = Number(insProt.rows[0].proteinid);
      }

      // Ensure PDB exists
      const selPdb = await client.query('SELECT pdbid FROM PDB WHERE pdbid = $1 LIMIT 1', [data.pdb_id]);
      if (!selPdb.rows.length) {
        await client.query(
          `INSERT INTO PDB (pdbid, method, resolution, chain, positions, deposited, class, url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [data.pdb_id, 'Unknown', null, 'A', '1-1', new Date(), null, null]
        );
      }

      // Insert mapping if not exists
      await client.query(
        'INSERT INTO PDB2Protein (PDBID, proteinID) SELECT $1, $2 WHERE NOT EXISTS (SELECT 1 FROM PDB2Protein WHERE PDBID = $1 AND proteinID = $2)',
        [data.pdb_id, proteinID]
      );

      await client.query('COMMIT');
      return { pdb_id: data.pdb_id, proteinID };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // Delete mapping and optionally PDB (we'll remove mapping and PDB row)
  async deletePdb(pdbId: string) {
    const pool = getPool();
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM PDB2Protein WHERE PDBID = $1', [pdbId]);
      await client.query('DELETE FROM PDB WHERE PDBID = $1', [pdbId]);
      await client.query('COMMIT');
      return { pdbId };
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },

  // List PDB entries joined with protein info
  async getAllPdbs(): Promise<PdbEntry[]> {
    const sql = `
      SELECT PDB.pdbid, PDB.method, PDB.resolution, PDB.class, Protein.name, Protein.organism
      FROM PDB
      NATURAL JOIN PDB2Protein
      NATURAL JOIN Protein
      ORDER BY PDB.pdbid DESC
    `;
    const rows = await query(sql);
    return rows.map((r: any) => ({
      pdbid: String(r.pdbid),
      method: r.method ?? null,
      resolution: r.resolution === null ? null : Number(r.resolution),
      class: r.class ?? null,
      name: r.name ?? null,
      organism: r.organism ?? null,
    }));
  }
};