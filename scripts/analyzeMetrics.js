import sqllite3 from 'sqlite3';
import util from 'util';
import path from 'path';

const dbPath = path.join(process.cwd(), 'metrics.db');
const db = new sqllite3.Database(dbPath);

// Promisify the database methods so we can use async/await
const dbAll = util.promisify(db.all).bind(db);
const dbClose = util.promisify(db.close).bind(db);

// Definimos umbrales (puedes ajustarlos según tu VPS)
const LIMITS = {
  durationMs: 3000, // 3 segundos
  memoryRssMb: 600, // 600 MB
  heapMb: 200, // 200 MB
};

async function analyze() {
  // Use await with the promisified dbAll method
  const rows = await dbAll('SELECT * FROM request_metrics ORDER BY created_at DESC LIMIT 50');

  const analyzed = rows.map((row) => {
    const flags = [];

    if (row.duration_ms > LIMITS.durationMs) flags.push('⚠️ Lento');
    if (row.memory_rss_mb > LIMITS.memoryRssMb) flags.push('⚠️ Memoria alta');
    if (row.memory_heap_mb > LIMITS.heapMb) flags.push('⚠️ Heap alto');

    return {
      ...row,
      flags: flags.length ? flags.join(', ') : '✅ OK',
    };
  });

  // Estadísticas globales
  const avgDuration = analyzed.reduce((a, r) => a + r.duration_ms, 0) / analyzed.length;
  const avgMem = analyzed.reduce((a, r) => a + r.memory_rss_mb, 0) / analyzed.length;

  console.log('📊 Últimos 50 requests analizados:');
  analyzed.forEach((r) => {
    console.log(
      `[${r.created_at}] ${r.route} ${r.method} | ${r.duration_ms.toFixed(0)} ms | ${r.memory_rss_mb.toFixed(
        1
      )} MB | ${r.flags}`
    );
  });

  console.log('\n📈 Promedios:');
  console.log(`⏱️ Duración promedio: ${avgDuration.toFixed(0)} ms`);
  console.log(`💾 Memoria promedio: ${avgMem.toFixed(1)} MB`);
  // Close the database connection
  await dbClose();
}

analyze();
