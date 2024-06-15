"use server";

//import { getURL } from "@/lib/getURL";
import { prisma } from "@/app/lib/prisma";

export async function fetchForms() {
  //try {
  const forms = await prisma.forms.findMany();
  //console.log("forms action:", forms);
  prisma.$disconnect();
  //console.log("forms action after: ", forms);
  return forms;
  ///} catch (error) {
  //  console.error("Database Error:", error);
  //throw new Error("Failed to fetch all forms.");
  //} finally {
  //prisma.$disconnect();
  //}
}


