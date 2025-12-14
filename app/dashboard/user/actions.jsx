'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { auth } from '@/auth';
import { wakeUpDb } from '@/app/lib/db-wake-up';
import { userCreateSchema, userEditSchema } from '@/lib/schemas/user';

/** Create a new user
 * @param {FormData} formData - Form data from the request
 * @throws {Error} If there is an error creating the user
 * */
export async function createUser(formData) {
  //console.log('createUser', formData);
  try {
    await wakeUpDb();
    // validar los datos con zod desde el schema userSchema
    const validateFields = userCreateSchema.safeParse({
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (!validateFields.success) {
      const validationErrors = {};
      validateFields.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          validationErrors[err.path[0]] = err.message;
        }
      });
      console.error('Invalid form data', parsedFormData.error);
      return {
        success: false,
        error: 'Error de validación. Por favor revisa los campos.',
        validationErrors,
      };
    }
    //console.log(formData);
    const data = validateFields.data;
    //console.log('Validated data:', data);
    // recuperar el id del usuario actual de la sesión
    const session = await auth();
    const userId = (session?.user?.id || '5df3b5c6-1c4a-4d2e-8f3b-5c61c4a4d2e8').toString();
    // hashear la contraseña antes de guardarla en la base de datos
    const hassedPassword = await bcrypt.hash(formData.password, 10);

    // guardar el nuevo usuario en la base de datos
    await prisma.users.create({
      data: {
        email: data.email,
        password: hassedPassword,
        id_user_create: userId,
      },
    });
    // revalidar la caché de la página de usuarios
    revalidatePath('/dashboard/user');
    //redirect('/dashboard/user');
    return { success: true, status: 201, message: 'Usuario creado correctamente' };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to create user: ${error}`,
    };
  }
}

/** Search users by name or email
 * @param {string} query - Search query
 * @return {Array} List of users matching the query
 * @throws {Error} If there is an error fetching the users
 * */
export async function fetchFilteredUsers(query) {
  //console.log("fetchFilteredMedicines", query, page, limit, sort, order);

  await wakeUpDb();
  const users = await prisma.users.findMany({
    where: {
      OR: [
        {
          user_name_full: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ],
    },
  });
  return { success: true, status: 200, users };
}

/** Search users by ID
 * @param {string} id - User ID
 * @return {Object} User object
 * @throws {Error} If there is an error fetching the user
 * */
export async function fetchUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id_user: id,
    },
  });

  return { success: true, status: 200, user };
}

export async function updateUser(id_user, formData) {
  try {
    await wakeUpDb();

    const validateFields = userEditSchema.safeParse(formData);

    if (!validateFields.success) {
      const validationErrors = {};
      validateFields.error.errors.forEach((err) => {
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

    const data = validateFields.data;
    const updateData = {
      user_name_full: data.user_name_full,
      email: data.email,
    };

    // Si se proporcionó una nueva contraseña, hashearla y agregarla a los datos de actualización
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    await prisma.users.update({
      where: {
        id_user: id_user,
      },
      data: updateData,
    });

    revalidatePath('/dashboard/user');
    return { success: true, message: 'Usuario actualizado correctamente' };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      error: `Failed to update user: ${error.message}`,
    };
  }
}

export async function deleteUser(id_user) {
  await prisma.users.delete({
    where: {
      id_user: id_user,
    },
  });

  revalidatePath('/dashboard/user');
}
