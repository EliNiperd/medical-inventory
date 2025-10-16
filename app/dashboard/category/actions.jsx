'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { categorySchema } from '@/lib/schemas/category';
import { wakeUpDb } from '@/app/lib/db-wake-up';

/**
 * Fetch all categories from the database
 * @returns {Array} List of categories
 * @throws {Error} If there is an error fetching the categories
 */
export async function fetchCategories() {
  // Paso intermedio: Despierta la DB antes de la consulta
  await wakeUpDb();

  try {
    const categories = await prisma.categories.findMany();
    //console.log("categories action:", categories);
    return { success: true, status: 200, categories: categories };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all categories.: ${error}`,
      categories: [],
    };
  }
}

/**
 * Fetch a category by id from the database
 * @param {*} id_category
 * @return {Object} Category by ID
 * @throws {Error} If there is an error fetching the category by ID
 */
export async function fetchCategoryById(id_category) {
  try {
    // validar que el id_category se recibió correctamente
    if (!id_category) {
      return {
        success: false,
        status: 400,
        error: 'Invalid category ID.',
        category: [],
      };
    }
    // Paso intermedio: Despierta la DB antes de la consulta
    await wakeUpDb();

    // recuperar el category por id de la base de datos
    const category = await prisma.categories.findUnique({
      where: {
        id_category: parseInt(id_category),
      },
    });

    // si no se encuentra el category, devolver un error 404
    if (!category) {
      return {
        success: false,
        status: 404,
        error: 'Category not found.',
        category: [],
      };
    }
    return { success: true, status: 200, category: category };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch category by ID.: ${error}`,
      category: [],
    };
  }
}

/** Search categories by name or description
 * @param {string} query - Search query
 * @return {Array} List of categories matching the query
 * @throws {Error} If there is an error fetching the categories
 * */
// , page, limit, sort, order
export async function fetchFilteredCategories(query) {
  try {
    // Paso intermedio: Despierta la DB antes de la consulta
    await wakeUpDb();
    const categories = await prisma.categories.findMany({
      where: {
        OR: [
          {
            category_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            category_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    // TODO: Revisar si es necesario este bloque
    // if (!categories) {
    //   return {
    //     success: false,
    //     status: 404,
    //     error: 'Categories not found.',
    //     categories: [],
    //   };
    // }
    return { success: true, status: 200, categories };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch filtered categories.: ${error}`,
      categories: [],
    };
  }
}

export async function createCategory(formData) {
  const validateCategory = schemaCategory.safeParse({
    category_name: formData.get('category_name'),
  });

  if (!validateCategory.success) {
    console.error('Invalid form data', validateCategory.error);
    return;
  }

  await prisma.categories.create({
    data: {
      category_name: formData.get('category_name'),
      category_description: formData.get('category_description') ?? '',
      id_user_create: '8d8b2e5c-649a-4793-bc56-b8ec3eb68b24',
    },
  });
  revalidatePath('/dashboard/category');
  redirect('/dashboard/category');
}

export async function updateCategory(id_category, formData) {
  const validateCategory = schemaCategory.safeParse({
    category_name: formData.get('category_name'),
  });

  if (!validateCategory.success) {
    console.error('Invalid category data', validateCategory.error);
    return;
  }

  await prisma.categories.update({
    where: {
      id_category: id_category,
    },
    data: {
      category_name: formData.get('category_name'),
      category_description: formData.get('category_description') ?? '',
      //update_at: new Date(),
    },
  });
  revalidatePath('/dashboard/category');
  redirect('/dashboard/category');
}

export async function deleteCategory(id_category) {
  try {
    const category = await prisma.categories.findUnique({
      where: {
        id_category: id_category,
      },
    });

    if (!category) {
      return JSON.stringify({ status: 500, error: 'Category not found.' });
    } else {
      await prisma.categories.delete({
        where: {
          id_category: id_category,
        },
      });
      revalidatePath('/dashboard/category');
      return JSON.stringify({ status: 200, message: 'Category deleted.' });
    }
  } catch (error) {
    return JSON.stringify({ status: 500, message: `Failed to delete category.: ${error}` });
  }
}
