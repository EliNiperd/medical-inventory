"use server";

//import { getURL } from "@/lib/getURL";
import { prisma } from "@/app/lib/prisma";
import { wakeUpDb } from "@/app/lib/db-wake-up";

export async function fetchCategorys() {
  // Paso intermedio: Despierta la DB antes de la consulta
  await wakeUpDb();

  try {
    const categorys = await prisma.categorys.findMany();
    //console.log("categorys action:", categorys);
    return categorys;
  } catch (error) {
    console.error("Database Error:", error);
    //throw new Error("Failed to fetch all categorys.");
  } 
}
