"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { schemaLocation } from "@/lib/schemas/location";
import { parseISO } from "date-fns";

export async function fetchLocations() {
  try {
    const locations = await prisma.locations.findMany();
    //console.log("locations action:", locations);
    prisma.$disconnect();
    //console.log("locations action after: ", locations);
    return locations;
  } catch (error) {
    //  console.error("Database Error:", error);
    throw new Error("Failed to fetch all locations.");
  } finally {
    prisma.$disconnect();
  }
}

export async function fetchLocationById(id_location) {
  const location = await prisma.locations.findUnique({
    where: {
      id_location: id_location,
    },
  });

  prisma.$disconnect();

  return location;
}

export async function fetchFilteredLocations(query, page, limit, sort, order) {
  //console.log("fetchFilteredMedicines", query, page, limit, sort, order);

  const locations = await prisma.locations.findMany({
    where: {
      OR: [
        {
          location_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          location_description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  prisma.$disconnect();

  return locations;
}


export async function createLocation(formData) {

  const validateForm = schemaLocation.safeParse({
    location_name: formData.get("location_name"),
  });

  if (!validateForm.success) {
    console.error("Invalid form data", validateForm.error);
    return;
  }

  await prisma.locations.create({
    data: {
      location_name: formData.get("location_name"),
      location_description: formData.get("location_description") ?? '',
      id_user_create: '8d8b2e5c-649a-4793-bc56-b8ec3eb68b24',
    },
  });

  prisma.$disconnect();

  revalidatePath("/dashboard/location");
  redirect("/dashboard/location");
}


export async function updateLocation(id_location, formData) {
  const validateForm = schemaLocation.safeParse({
    location_name: formData.get("location_name"),
  });

  if (!validateForm.success) {
    console.error("Invalid form data", validateForm.error);
    return;
  }

  await prisma.locations.update({
    where: {
      id_location: id_location,
    },
    data: {
      location_name: formData.get("location_name"),
      location_description: formData.get("location_description") ?? '',
      updated_at: new Date(),
    },
  });

  prisma.$disconnect();

  revalidatePath("/dashboard/location");
  redirect("/dashboard/location");
}


export async function deleteLocation(id_location) {
  try {
    const location = await prisma.locations.findUnique({
      where: {
        id_location: id_location,
      },
    });

    if (!location) {
      //throw new Error("Location not found.");
      return JSON.stringify({ status: 500, error: "Location not found." });
    }
    else {
      await prisma.locations.delete({
        where: {
          id_location: id_location,
        },
      });
      prisma.$disconnect();
      revalidatePath("/dashboard/location");
      return JSON.stringify({ "status": 200, "message": "Location deleted." });
    }
  } catch (error) {
    prisma.$disconnect();
    return JSON.stringify({ "status": 500, "message": "Failed to delete location." });
    //throw new Error("Failed to delete location.");
  }



}