import prisma from './prisma';

export async function wakeUpDb() {
  try {
    // console.log('Intentando despertar la base de datos...'); // 🔍 Solo para Debuggear
    await prisma.$queryRaw`SELECT 1`;
    // console.log('¡Base de datos despierta!'); // 🔍 Solo para Debuggear
    return true;
  } catch (error) {
    // console.error('Error al despertar la base de datos:', error); // 🔍 Solo para Debuggear
    throw new Error('Failed to wakeUpDb.', error);
    //return false;
  }
}
