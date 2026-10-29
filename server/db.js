import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.CRM_DATA_DIR || path.join(__dirname, 'data');
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'crm.sqlite');
export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    collection TEXT NOT NULL,
    value_json TEXT NOT NULL,
    idempotency_key TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_records_collection ON records(collection);
  CREATE UNIQUE INDEX IF NOT EXISTS idx_records_idempotency
    ON records(collection, idempotency_key)
    WHERE idempotency_key IS NOT NULL;
`);

export function listRecords(collection, limit = 100) {
  const rows = db
    .prepare(
      `SELECT id, value_json AS value
       FROM records
       WHERE collection = ?
       ORDER BY datetime(updated_at) DESC
       LIMIT ?`,
    )
    .all(collection, limit);
  return {
    records: rows.map((r) => ({ id: r.id, value: JSON.parse(r.value) })),
  };
}

export function createRecord(collection, value, idempotencyKey, id) {
  if (idempotencyKey) {
    const existing = db
      .prepare(
        `SELECT id, value_json AS value FROM records
         WHERE collection = ? AND idempotency_key = ?`,
      )
      .get(collection, idempotencyKey);
    if (existing) {
      return { id: existing.id, value: JSON.parse(existing.value) };
    }
  }

  const recordId = id || crypto.randomUUID();
  db.prepare(
    `INSERT INTO records (id, collection, value_json, idempotency_key)
     VALUES (?, ?, ?, ?)`,
  ).run(recordId, collection, JSON.stringify(value), idempotencyKey || null);

  return { id: recordId, value };
}

export function replaceRecord(collection, id, value) {
  const result = db
    .prepare(
      `UPDATE records
       SET value_json = ?, updated_at = datetime('now')
       WHERE collection = ? AND id = ?`,
    )
    .run(JSON.stringify(value), collection, id);
  if (result.changes === 0) {
    const err = new Error('not found');
    err.status = 404;
    throw err;
  }
  return { id, value };
}

export function deleteRecord(collection, id) {
  const result = db
    .prepare(`DELETE FROM records WHERE collection = ? AND id = ?`)
    .run(collection, id);
  return result.changes > 0;
}
