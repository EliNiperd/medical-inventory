import { prisma } from "./prisma";

export async function wakeUpDb() {
    try {
        console.log('Intentando despertar la base de datos...');
        await prisma.$queryRaw`SELECT 1`;
        console.log("¡Base de datos despierta!");
        return true;
    } catch (error) {
        console.error('Error al despertar la base de datos:', error);
        return false;
    } 
}
