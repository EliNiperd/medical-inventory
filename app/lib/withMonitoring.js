import { NextResponse } from 'next/server';
import initDb from '@/app/lib/db-logging';
import util from 'util';

export function withMonitoring(handler, routeName) {
  return async (req) => {
    const start = process.hrtime.bigint();
    const cpuStart = process.cpuUsage();

    try {
      const response = await handler(req);

      const end = process.hrtime.bigint();
      const cpuEnd = process.cpuUsage(cpuStart);
      const memEnd = process.memoryUsage();

      const durationMs = Number(end - start) / 1_000_000;

      const db = await initDb();

      // 1. Get the statement object SYNCHRONOUSLY
      const stmt = db.prepare(`
        INSERT INTO request_metrics 
        (route, method, duration_ms, cpu_user_ms, cpu_system_ms, memory_rss_mb, memory_heap_mb) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      // 2. Promisify the statement's run method
      const stmtRun = util.promisify(stmt.run).bind(stmt);

      // 3. Await the execution of the statement
      await stmtRun(
        routeName,
        req.method,
        durationMs,
        cpuEnd.user / 1000,
        cpuEnd.system / 1000,
        memEnd.rss / 1024 / 1024,
        memEnd.heapUsed / 1024 / 1024
      );

      // 4. Close the statement to release resources
      stmt.finalize();

      return response;
    } catch (err) {
      console.error('❌ Error in monitored handler:', err);
      // Ensure we still return a valid response, even on error
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
