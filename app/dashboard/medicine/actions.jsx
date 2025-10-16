'use server';

import { wakeUpDb } from '@/app/lib/db-wake-up';
import prisma from '@/app/lib/prisma';
import { parseISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { medicineSchema } from '@/lib/schemas/medicine.js';

// ============================================
// FETCH MEDICINES (READ)
// ============================================
export async function fetchFilteredMedicines(
  query = '',
  page = 1,
  limit = 10,
  sort = 'name_medicine',
  order = 'asc'
) {
  await wakeUpDb();
  try {
    // Asegurar que los valores numéricos y de ordenamiento sean válidos
    const safePage = Number(page) || 1;
    const safeLimit = Number(limit) || 10;
    const safeSort = sort || 'name_medicine';
    const safeOrder = order || 'asc';

    const skip = (safePage - 1) * safeLimit;
    const orderBy = { [safeSort]: safeOrder };

    // Query con paginación
    const [medicines, total] = await Promise.all([
      prisma.medicines_Table.findMany({
        where: {
          OR: [
            {
              name_medicine: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              category_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              form_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              location_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: skip,
        //take: safeLimit,
        orderBy,
      }),
      prisma.medicines_Table.count({
        where: {
          OR: [
            {
              name_medicine: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              category_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              form_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              location_name: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: skip,
        take: safeLimit,
      }),
    ]);
    return {
      success: true,
      medicines,
      pagination: {
        total,
        safePage,
        safeLimit,
        pagination: Math.ceil(total / safeLimit),
      },
    };
  } catch (error) {
    //console.log('error fetchFilteredMedicines', error);
    return {
      success: false,
      error: `error al obtener medicamentos: ${error.message}`,
      medicines: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      },
    };
  }
  //const medicines = data.medicines;
  //console.log(medicines);
  //return medicines;
}

// ============================================
// FETCH MEDICINE BY ID (READ ONE)
// ============================================
export async function fetchMedicineById(id) {
  //console.log(id);
  try {
    if (!id) {
      return {
        success: false,
        error: 'error al obtener medicamento: id no proporcionado',
        medicine: [],
      };
    }
    const medicine = await prisma.medicines.findUnique({
      where: {
        id: id,
      },
      // include: {
      //   categories: true,
      //   forms: true,
      //   locations: true,
      // },
    });

    if (!medicine) {
      return {
        success: false,
        error: 'error al obtener medicamento: medicamento no encontrado',
        medicine: [],
      };
    }

    return {
      success: true,
      medicine: medicine,
    };

    //console.log(medicine);
    //return medicine;
  } catch (error) {
    //console.log('error fetchMedicineById', error);
    return {
      success: false,
      error: `error al obtener medicamento: ${error.message}`,
      medicine: [],
    };
  }
}

export async function createMedicine(formData) {
  //console.log(formData);
  try {
    // 1. Validar datos con Zod
    const validatedFields = medicineSchema.safeParse({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      expiration_date: formData.expiration_date,
      idCategory: formData.idCategory,
      idForm: formData.idForm,
      packsize: formData.packsize,
      reorder_point: formData.reorder_point,
      idLocation: formData.idLocation,
    });

    // 2. Si la validación falla, retornar errores
    if (!validatedFields.success) {
      const validationErrors = {};
      validatedFields.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          validationErrors[err.path[0]] = err.message;
        }
      });
      return {
        success: false,
        error: 'Error de validación. Por favor revisa los campos.',
        validationErrors,
      };
    }

    const { data } = validatedFields;

    // 2. TODO: Obtener user ID de sesión en lugar de hardcoded
    // const session = await auth();
    // const userId = session?.user?.id;
    const userId = '5d743e4d-1724-4501-94d2-7d9de771cc66'; // Temporal

    // 3. Guardar en la base de datos
    await prisma.medicines.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        expiration_date: parseISO(data.expiration_date),
        idCategory: data.idCategory,
        idForm: data.idForm,
        packsize: data.packsize,
        reorder_point: data.reorder_point,
        idLocation: data.idLocation,
        id_user_create: userId,
      },
    });

    // 4. Revalidar caché
    revalidatePath('/dashboard/medicine');
    //redirect('/dashboard/medicine');
    // 5. Retornar éxito (no se redirecciona para mejorar la experiencia UX)
    return {
      success: true,
      message: 'Medicamento creado correctamente',
      //medicine,
    };
  } catch (error) {
    // Otros errores
    return {
      success: false,
      error: `error al crear medicamento: ${error.message}`,
      //medicine: [],
    };
  }
}

export async function updateMedicine(id, formData) {
  //console.log('updateMedicine: ', id, formData);
  try {
    // 1. Validar datos con Zod
    const validatedFields = medicineSchema.safeParse({
      name: formData.name,
      description: formData.description,
      price: formData.price,
      quantity: formData.quantity,
      expiration_date: formData.expiration_date,
      idCategory: formData.idCategory,
      idForm: formData.idForm,
      packsize: formData.packsize,
      reorder_point: formData.reorder_point,
      idLocation: formData.idLocation,
    });

    // 2. Si la validación falla, retornar errores
    if (!validatedFields.success) {
      const validationErrors = {};
      validatedFields.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          validationErrors[err.path[0]] = err.message;
        }
      });
      return {
        success: false,
        error: 'Error de validación. Por favor revisa los campos.',
        validationErrors,
      };
    }

    const { data } = validatedFields;

    const dataToUpdate = {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      expiration_date: data.expiration_date ? parseISO(data.expiration_date) : new Date(),
      idCategory: data.idCategory,
      idForm: data.idForm,
      packsize: data.packsize,
      reorder_point: data.reorder_point,
      idLocation: data.idLocation,
    };

    await prisma.medicines.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });

    revalidatePath('/dashboard/medicine');
    //redirect('/dashboard/medicine');
    // 5. Retornar éxito (no se redirecciona para mejorar la experiencia UX)
    return {
      success: true,
      message: 'Medicamento actualizado correctamente',
      //medicine,
    };
  } catch (error) {
    // Otros errores
    return {
      success: false,
      error: `error al actualizar medicamento: ${error.message}`,
      //medicine: [],
    };
  }
}

export async function deleteMedicine(id) {
  try {
    const medicine = await prisma.medicines.findUnique({
      where: {
        id: id,
      },
    });

    if (!medicine) {
      return JSON.stringify({
        status: 404,
        success: false,
        error: 'error al eliminar medicamento: medicamento no encontrado',
      });
    } else {
      await prisma.medicines.delete({
        where: {
          id: id,
        },
      });

      revalidatePath('/dashboard/medicine');
      return JSON.stringify({
        status: 200,
        success: true,
        message: 'Medicamento eliminado correctamente',
      });
    }
  } catch (error) {
    return JSON.stringify({
      status: 500,
      success: false,
      message: `error al eliminar medicamento: ${error.message}`,
    });
  }
}
