import fs from "fs";
import path from "path";
import { pool } from "./index.js";

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<string[]> {
  const result = await pool.query("SELECT name FROM _migrations ORDER BY id");
  return result.rows.map((r: any) => r.name);
}

async function runMigrations() {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const migrationsDir = path.join(import.meta.dirname, "migrations");
  const files = fs.readdirSync(migrationsDir)
    .filter((f: string) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.includes(file)) {
      console.log(`  ✓ ${file} (already applied)`);
      continue;
    }

    console.log(`  ▸ Applying ${file}...`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query("INSERT INTO _migrations (name) VALUES ($1)", [file]);
      await client.query("COMMIT");
      console.log(`  ✓ ${file} applied`);
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`  ✗ ${file} failed:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  console.log("Migrations complete.");
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
