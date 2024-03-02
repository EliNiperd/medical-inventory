"use server";

//import { getURL } from "@/lib/getURL";
import { prisma } from "@/app/lib/prisma";

export async function fetchLocations() {
  //try {
  const locations = await prisma.locations.findMany();
  //console.log("locations action:", locations);
  prisma.$disconnect();
  //console.log("locations action after: ", locations);
  return locations;
  ///} catch (error) {
  //  console.error("Database Error:", error);
  //throw new Error("Failed to fetch all locations.");
  //} finally {
  //prisma.$disconnect();
  //}
}
