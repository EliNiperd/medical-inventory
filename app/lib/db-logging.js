import sqlite3 from 'sqlite3';
import path from 'path';

// Utiliza una promesa para controlar la inicialización
let db = null;
let initPromise = null;

// Creamos una función asíncrona para inicializar la base de datos
async function initDb() {
  // Si la conexión ya existe, no la volvemos a crear
  if (db) {
    return db;
  }

  // La promesa asegura que la inicialización solo se haga una vez
  if (!initPromise) {
    initPromise = new Promise((resolve, reject) => {
      const dbPath = path.join(process.cwd(), 'metrics.db');
      const newDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error al conectar a la base de datos:', err);
          reject(err);
        } else {
          console.log("Conexión a la base de datos 'metrics.db' establecida.");
          // Usamos db.exec con una promesa para asegurar que la tabla se cree
          newDb.exec(
            `
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
                    `,
            (execErr) => {
              if (execErr) {
                console.error('Error al crear la tabla:', execErr);
                reject(execErr);
              } else {
                db = newDb;
                resolve(db);
              }
            }
          );
        }
      });
    });
  }

  return initPromise;
}

export default initDb;
