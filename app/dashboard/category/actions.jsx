"use server";

//import { getURL } from "@/lib/getURL";
import { prisma } from "@/app/lib/prisma";

export async function fetchCategorys() {
  //try {
  const categorys = await prisma.categorys.findMany();
  //console.log("categorys action:", categorys);
  prisma.$disconnect();
  //console.log("categorys action after: ", categorys);
  return categorys;
  ///} catch (error) {
  //  console.error("Database Error:", error);
  //throw new Error("Failed to fetch all categorys.");
  //} finally {
  //prisma.$disconnect();
  //}
}
