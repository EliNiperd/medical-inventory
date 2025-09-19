"use server";

//import { getURL } from "@/lib/getURL";
import  prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { schemaCategory } from "@/lib/schemas/category";
import { wakeUpDb } from "@/app/lib/db-wake-up";

export async function fetchCategorys() {
  // Paso intermedio: Despierta la DB antes de la consulta
  await wakeUpDb();

  try {
    const categorys = await prisma.categorys.findMany();
    //console.log("categorys action:", categorys);
    return categorys;
  } catch (error) {
    console.error("Database Error:", error);
    //throw new Error("Failed to fetch all categorys.");
  } 
}

export async function fetchCategoryById(id_category) {
  const category = await prisma.categorys.findUnique({
    where: {
      id_category: parseInt(id_category),
    },
  });
  return category;
}

export async function fetchFilteredCategorys(query, page, limit, sort, order) {
  const categorys = await prisma.categorys.findMany({
    where: {
      OR: [
        {
          category_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category_description: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return categorys;
}


export async function createCategory(formData) {
  const validateCategory = schemaCategory.safeParse({
    category_name: formData.get("category_name"),
  });

  if (!validateCategory.success) {
    console.error("Invalid form data", validateCategory.error);
    return;
  }

  await prisma.categorys.create({
    data: {
      category_name: formData.get("category_name"),
      category_description: formData.get("category_description") ?? '',
      id_user_create: '8d8b2e5c-649a-4793-bc56-b8ec3eb68b24',
    },
  });
  revalidatePath("/dashboard/category");
  redirect("/dashboard/category");
}

export async function updateCategory(id_category, formData) {
  const validateCategory = schemaCategory.safeParse({
    category_name: formData.get("category_name"),
  });

  if (!validateCategory.success) {
    console.error("Invalid category data", validateCategory.error);
    return;
  }

  await prisma.categorys.update({
    where: {
      id_category: id_category,
    },
    data: {
      category_name: formData.get("category_name"),
      category_description: formData.get("category_description") ?? '',
      //update_at: new Date(),
    },
  });
  revalidatePath("/dashboard/category");
  redirect("/dashboard/category");
}

export async function deleteCategory(id_category) {
  try {
    const category = await prisma.categorys.findUnique({
      where: {
        id_category: id_category,
      },
    });

    if (!category) {
      return JSON.stringify({ status: 500, error: "Category not found." });
    } else {
      await prisma.categorys.delete({
        where: {
          id_category: id_category,
        },
      });
      revalidatePath("/dashboard/category");
      return JSON.stringify({ "status": 200, "message": "Category deleted." });
    }
  } catch (error) {
    return JSON.stringify({ "status": 500, "message": "Failed to delete category." });
  }
}