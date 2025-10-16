'use server';

import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { formSchema } from '@/lib/schemas/form';
import { wakeUpDb } from '@/app/lib/db-wake-up';

/**
 * Fetch all forms from the database
 * @returns {Array} List of forms
 * @throws {Error} If there is an error fetching the forms
 */
export async function fetchForms() {
  try {
    await wakeUpDb();
    const forms = await prisma.forms.findMany();
    return { success: true, status: 200, forms };
  } catch (error) {
    console.error('Database Error:', error);
    //throw new Error('Failed to fetch all forms.');
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all forms.: ${error}`,
      forms: [],
    };
  }
}

/**
 * Fetch a form by its ID
 * @param {*} id_form
 * @returns {Object} Form by ID
 * @throws {Error} If there is an error fetching the form by ID
 */
export async function fetchFormById(id_form) {
  try {
    // validar que el id_form se recibió correctamente
    if (!id_form || isNaN(id_form)) {
      return {
        success: false,
        status: 400,
        error: 'Invalid form ID.',
        form: [],
      };
    }
    // recuperar el form por id de la base de datos
    const form = await prisma.forms.findUnique({
      where: {
        id_form: id_form,
      },
    });

    // si no se encuentra el form, devolver un error 404
    if (!form) {
      return {
        success: false,
        status: 404,
        error: 'Form not found.',
        form: [],
      };
    }

    return { success: true, status: 200, form };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch form by ID.: ${error}`,
      form: [],
    };
  }
}

/** Search forms by name or description
 * @param {string} query - Search query
 * @return {Array} List of forms matching the query
 * @throws {Error} If there is an error fetching the forms
 * */
// , page, limit, sort, order
export async function fetchFilteredForms(query) {
  try {
    await wakeUpDb();
    const forms = await prisma.forms.findMany({
      where: {
        OR: [
          {
            form_name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            form_description: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return { success: true, status: 200, forms };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      success: false,
      status: 500,
      error: `Failed to fetch all forms.: ${error}`,
      forms: [],
    };
  }
}

export async function createForm(formData) {
  const validateForm = schemaForm.safeParse({
    form_name: formData.get('form_name'),
  });

  if (!validateForm.success) {
    console.error('Invalid form data', validateForm.error);
    return;
  }

  await prisma.forms.create({
    data: {
      form_name: formData.get('form_name'),
      form_description: formData.get('form_description') ?? '',
      id_user_create: '8d8b2e5c-649a-4793-bc56-b8ec3eb68b24',
    },
  });
  revalidatePath('/dashboard/form');
  redirect('/dashboard/form');
}

export async function updateForm(id_form, formData) {
  const validateForm = schemaForm.safeParse({
    form_name: formData.get('form_name'),
  });

  if (!validateForm.success) {
    console.error('Invalid form data', validateForm.error);
    return;
  }

  await prisma.forms.update({
    where: {
      id_form: id_form,
    },
    data: {
      form_name: formData.get('form_name'),
      form_description: formData.get('form_description') ?? '',
      update_at: new Date(),
    },
  });
  revalidatePath('/dashboard/form');
  redirect('/dashboard/form');
}

export async function deleteForm(id_form) {
  try {
    const form = await prisma.forms.findUnique({
      where: {
        id_form: id_form,
      },
    });

    if (!form) {
      return JSON.stringify({ status: 500, error: 'Form not found.' });
    } else {
      await prisma.forms.delete({
        where: {
          id_form: id_form,
        },
      });
      revalidatePath('/dashboard/form');
      return JSON.stringify({ status: 200, message: 'Form deleted.' });
    }
  } catch (error) {
    return JSON.stringify({ status: 500, message: `Failed to delete form: ${error}` });
  }
}
