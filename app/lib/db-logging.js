import Database from 'better-sqlite3';
import path from 'path';

// Ruta al archivo SQLite (se creará si no existe)
const dbPath = path.join(process.cwd(), 'metrics.db');
const db = new Database(dbPath);

// Crear tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS request_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route TEXT,
    method TEXT,
    duration_ms REAL,
    cpu_user_ms REAL,
    cpu_system_ms REAL,
    memory_rss_mb REAL,
    memory_heap_mb REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
