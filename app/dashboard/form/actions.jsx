"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { schemaForm } from "@/lib/schemas/form";
import { parseISO } from "date-fns";

export async function fetchForm() {
  try {
    const forms = await prisma.forms.findMany();
    //console.log("locations action:", locations);
    prisma.$disconnect();
    //console.log("locations action after: ", locations);
    return forms;
  } catch (error) {
    //  console.error("Database Error:", error);
    throw new Error("Failed to fetch all forms.");
  } finally {
    prisma.$disconnect();
  }
}

export async function fetchFormById(id_form) {
  const form = await prisma.forms.findUnique({
    where: {
      id_form: id_form,
    },
  });

  prisma.$disconnect();

  return form;
}

export async function fetchFilteredForms(query, page, limit, sort, order) {
  //console.log("fetchFilteredMedicines", query, page, limit, sort, order);

  const forms = await prisma.forms.findMany({
    where: {
      OR: [
        {
          form_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          form_description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  prisma.$disconnect();

  return forms;
}


export async function createForm(formData) {

  const validateForm = schemaForm.safeParse({
    form_name: formData.get("form_name"),
  });

  if (!validateForm.success) {
    console.error("Invalid form data", validateForm.error);
    return;
  }

  await prisma.forms.create({
    data: {
      form_name: formData.get("form_name"),
      form_description: formData.get("form_description") ?? '',
      id_user_create: '8d8b2e5c-649a-4793-bc56-b8ec3eb68b24',
    },
  });

  prisma.$disconnect();

  revalidatePath("/dashboard/form");
  redirect("/dashboard/form");
}


export async function updateForm(id_form, formData) {
  const validateForm = schemaForm.safeParse({
    form_name: formData.get("form_name"),
  });

  if (!validateForm.success) {
    console.error("Invalid form data", validateForm.error);
    return;
  }

  await prisma.forms.update({
    where: {
      id_form: id_form,
    },
    data: {
      form_name: formData.get("form_name"),
      form_description: formData.get("form_description") ?? '',
      update_at: new Date(),
    },
  });

  prisma.$disconnect();

  revalidatePath("/dashboard/form");
  redirect("/dashboard/form");
}


export async function deleteForm(id_form) {
  try {
    const form = await prisma.forms.findUnique({
      where: {
        id_form: id_form,
      },
    });

    if (!form) {
      //throw new Error("Location not found.");
      return JSON.stringify({ status: 500, error: "Form not found." });
    }
    else {
      await prisma.forms.delete({
        where: {
          id_form: id_form,
        },
      });
      prisma.$disconnect();
      revalidatePath("/dashboard/form");
      return JSON.stringify({ "status": 200, "message": "Form deleted." });
    }
  } catch (error) {
    prisma.$disconnect();
    return JSON.stringify({ "status": 500, "message": "Failed to delete form." });
    //throw new Error("Failed to delete location.");
  }



}