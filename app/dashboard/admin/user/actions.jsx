"use server";

import { prisma } from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { z } from "zod";

export async function createUser(formData) {
  const registerUSerSchema = z
    .object({
      email: z.string()
        .min(1, 'Please enter your email')
        .email('Please enter a valid email address'),
      password: z.string()
        .min(1, 'Please enter your password')
        .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z.string()
        .min(1, 'Please enter your password confirmation')
        .min(6, 'Password must be at least 6 characters long'),
      /*.refine((data) => data === password, {
        message: "Las contraseñas no coinciden",
      }),*/
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    });

  const parsedFormData = registerUSerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  console.log(
    "registerUserSchema",
    registerUSerSchema,
    "parsedFormData",
    parsedFormData
  );
  //return;
  console.log(
    "registerUserSchema",
    registerUSerSchema,
    "parsedFormData",
    parsedFormData
  );
  //return;
  if (!parsedFormData.success) {
    console.error("Invalid form data", parsedFormData.error);
    return;
  }

  //console.log(formData);

  const hassedPassword = await bcrypt.hash(formData.get("password"), 10);
  const { email, password } = {
    email: formData.get("email"),
    password: hassedPassword,
  };

  //console.log(email, password);

  await prisma.users.create({
    data: {
      email,
      password,
    },
  });

  

  revalidatePath("/dashboard/admin/user");
  redirect("/dashboard/admin/user");
}

export async function fetchFilteredUsers(query, page, limit, sort, order) {
  //console.log("fetchFilteredMedicines", query, page, limit, sort, order);

  const users = await prisma.users.findMany({
    where: {
      OR: [
        {
          user_name_full: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

 
  return users;
}

export async function fetchUserById(id) {
  const user = await prisma.users.findUnique({
    where: {
      id_user: id,
    },
  });

  

  return user;
}

export async function updateUser(id_user, formData) {
  console.log("updateUser", id_user, formData.get("password"));

  // Obtener el usuario actual de la base de datos
  const currentUser = await fetchUserById(id_user);

  if (currentUser.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  // Verificar si la contraseña ha sido modificada
  let hashedPassword = currentUser.password;
  if (formData.get("password") && formData.get("password") !== currentUser.password) {
    // Si la contraseña ha sido modificada, generar un nuevo hash
    hashedPassword = await bcrypt.hash(formData.get("password"), 10);
  }

  //const hassedPassword = await bcrypt.hash(formData.get("password"), 10);

  const { user_name_full, email, password } = {
    user_name_full: formData.get("user_name_full"),
    email: formData.get("email"),
    password: hashedPassword,
  };

  await prisma.users.update({
    where: {
      id_user: id_user,
    },
    data: {
      user_name_full,
      email,
      password,
    },
  });

 
  revalidatePath("/dashboard/admin/user");
  redirect("/dashboard/admin/user");
}

export async function deleteUser(id_user) {
  await prisma.users.delete({
    where: {
      id_user: id_user,
    },
  });

   revalidatePath("/dashboard/admin/user");
}
