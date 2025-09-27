import { NextResponse } from 'next/server';
import db from '@/app/lib/db-logging';

export function withMonitoring(handler, routeName) {
  return async (req) => {
    const start = process.hrtime.bigint();
    const cpuStart = process.cpuUsage();
    const memStart = process.memoryUsage();

    try {
      const response = await handler(req);

      const end = process.hrtime.bigint();
      const cpuEnd = process.cpuUsage(cpuStart);
      const memEnd = process.memoryUsage();

      const durationMs = Number(end - start) / 1_000_000;

      // Guardar en SQLite
      const stmt = db.prepare(`
        INSERT INTO request_metrics 
        (route, method, duration_ms, cpu_user_ms, cpu_system_ms, memory_rss_mb, memory_heap_mb) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        routeName,
        req.method,
        durationMs,
        cpuEnd.user / 1000,
        cpuEnd.system / 1000,
        memEnd.rss / 1024 / 1024,
        memEnd.heapUsed / 1024 / 1024
      );

      return response;
    } catch (err) {
      console.error('❌ Error in monitored handler:', err);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
