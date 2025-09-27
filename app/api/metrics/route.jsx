import db from '@/app/lib/db-logging';

export async function GET() {
  const rows = db.prepare('SELECT * FROM request_metrics ORDER BY created_at DESC LIMIT 20').all();
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
