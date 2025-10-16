'use server';

import { auth } from '@/auth';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { locationSchema } from '@/lib/schemas/location';
import { wakeUpDb } from '@/app/lib/db-wake-up';

/** Fetch all locations from the database
 * @returns {Array} List of locations
 * @throws {Error} If there is an error fetching the locations
 */
export async function fetchLocations() {
  // Paso intermedio: Despierta la DB antes de la consulta
  await wakeUpDb();

  try {
    const locations = await prisma.locations.findMany();
    return { success: true, status: 200, locations: locations };
    //console.log("locations action:", locations);
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all locations.: ${error}`,
      locations: [],
    };
  }
}

/** Fetch a location by id from the database
 * @param {*} id_location
 * @return {Object} Location by ID
 * @throws {Error} If there is an error fetching the location by ID
 * */
export async function fetchLocationById(id_location) {
  try {
    // validar que el id_location se recibió correctamente
    if (!id_location) {
      return {
        success: false,
        status: 400,
        error: 'Invalid location ID.',
        location: [],
      };
    }
    // Paso intermedio: Despierta la DB antes de la consulta
    await wakeUpDb();

    // recuperar el location por id de la base de datos
    const location = await prisma.locations.findUnique({
      where: {
        id_location: id_location,
      },
    });

    // si no se encuentra el location, devolver un error 404
    if (!location) {
      return {
        success: false,
        status: 404,
        error: 'Location not found.',
        location: [],
      };
    }

    return { success: true, status: 200, location };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all locations.: ${error}`,
      locations: [],
    };
  }
}

/** Search locations by name or description
 * @param {string} query - Search query
 * @return {Array} List of locations matching the query
 * @throws {Error} If there is an error fetching the locations
 * */
//, page, limit, sort, order
export async function fetchFilteredLocations(query) {
  //console.log('fetchFilteredMedicines', query);

  try {
    await wakeUpDb();
    const locations = await prisma.locations.findMany({
      where: {
        OR: [
          {
            location_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            location_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });

    return {
      success: true,
      status: 200,
      locations,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all locations.: ${error}`,
      locations: [],
    };
  }
}

export async function createLocation(formData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return {
      success: false,
      status: 401,
      error: 'Authentication required',
    };
  }
  const userId = session.user.id;

  const validatedFields = locationSchema.safeParse({
    location_name: formData.get('location_name'),
    location_description: formData.get('location_description'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      status: 400,
      error: 'Invalid form data',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { location_name, location_description } = validatedFields.data;

  try {
    await prisma.locations.create({
      data: {
        location_name,
        location_description: location_description ?? '',
        id_user_create: userId,
      },
    });

    revalidatePath('/dashboard/location');
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to create location: ${error.message}`,
    };
  }

  redirect('/dashboard/location');
}

export async function updateLocation(id_location, formData) {
  const validateForm = locationSchema.safeParse({
    location_name: formData.get('location_name'),
  });

  if (!validateForm.success) {
    console.error('Invalid form data', validateForm.error);
    return;
  }

  await prisma.locations.update({
    where: {
      id_location: id_location,
    },
    data: {
      location_name: formData.get('location_name'),
      location_description: formData.get('location_description') ?? '',
      updated_at: new Date(),
    },
  });

  revalidatePath('/dashboard/location');
  redirect('/dashboard/location');
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
      return JSON.stringify({ status: 500, error: 'Location not found.' });
    } else {
      await prisma.locations.delete({
        where: {
          id_location: id_location,
        },
      });

      revalidatePath('/dashboard/location');
      return JSON.stringify({ status: 200, message: 'Location deleted.' });
    }
  } catch (error) {
    return JSON.stringify({ status: 500, message: `Failed to delete location: ${error}` });
    //throw new Error("Failed to delete location.");
  }
}
