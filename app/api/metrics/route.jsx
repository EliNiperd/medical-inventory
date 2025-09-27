import initDb from '@/app/lib/db-logging';
import util from 'util';

export async function GET() {
  try {
    // 1. Obtener la conexión a la base de datos de forma asíncrona
    const db = await initDb();

    // 2. Promisificar los métodos de la base de datos para usar await
    // Este paso es crucial para que .all() funcione de forma asíncrona
    const dbAll = util.promisify(db.all).bind(db);

    // 3. Ejecutar la consulta de forma asíncrona con await
    const rows = await dbAll('SELECT * FROM request_metrics ORDER BY created_at DESC LIMIT 20');

    // 4. Devolver la respuesta como JSON
    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al obtener las métricas:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
