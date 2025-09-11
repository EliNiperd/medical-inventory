"use server";

import { wakeUpDb } from "@/app/lib/db-wake-up";
//import { getURL } from "@/lib/getURL";
import  prisma  from "@/app/lib/prisma";
import { parseISO } from "date-fns";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function fetchFilteredMedicines(query, page, limit, sort, order) {
  //console.log("fetchFilteredMedicines", query, page, limit, sort, order);
  /* const res = await fetch(
    getURL(
      `/api/medicine?query=${query}&page=${page}&limit=${limit}&sort=${sort}&order=${order}`
    )
  );
  const data = await res.json();
  */

  await wakeUpDb();
  

  const medicines = await prisma.medicines_Table.findMany({
    where: {
      OR: [
        {
          name_medicine: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          category_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          form_name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          location_name: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  //const medicines = data.medicines;
  //console.log(medicines);
  return medicines;
}

export async function fetchMedicineById(id) {
  //console.log(id);
  const medicine = await prisma.medicines.findUnique({
    where: {
      id: id,
    },
  });

  //console.log(medicine);
  return medicine;
}

export async function createMedicine(formData) {
  //console.log(formData);
  const {
    name,
    description,
    price,
    quantity,
    expiration_date,
    category,
    form,
    packsize,
    reorder_point,
    location,
  } = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price") ? parseFloat(formData.get("price")) : 0,
    quantity: formData.get("quantity") ? parseInt(formData.get("quantity")) : 1,
    expiration_date: formData.get("expirationDate")
      ? parseISO(formData.get("expirationDate"))
      : parseISO(new Date()),
    category: formData.get("category") ? parseInt(formData.get("category")) : 1,
    form: formData.get("form"),
    packsize: formData.get("packsize") ? parseInt(formData.get("packsize")) : 1,
    reorder_point: formData.get("reorder_point")
      ? parseInt(formData.get("reorder_point"))
      : 0,
    location: formData.get("location"),
  };

  //console.log(formData);

  await prisma.medicines.create({
    data: {
      name,
      description,
      price,
      quantity,
      expiration_date,
      idCategory: category,
      idForm: form,
      packsize,
      reorder_point,
      idLocation: location,
    },
  });

  revalidatePath("/dashboard/medicine");
  redirect("/dashboard/medicine");
}

export async function updateMedicine(id, formData) {
  //console.log(formData, id);
  const {
    name,
    description,
    price,
    quantity,
    expiration_date,
    category,
    form,
    packsize,
    reorder_point,
    location,
  } = {
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price") ? parseFloat(formData.get("price")) : 0,
    quantity: formData.get("quantity") ? parseInt(formData.get("quantity")) : 1,
    expiration_date: formData.get("expirationDate")
      ? parseISO(formData.get("expirationDate"))
      : parseISO(new Date()),
    category: formData.get("category") ? parseInt(formData.get("category")) : 1,
    form: formData.get("form"),
    packsize: formData.get("packsize") ? parseInt(formData.get("packsize")) : 1,
    reorder_point: formData.get("reorder_point")
      ? parseInt(formData.get("reorder_point"))
      : 1,
    location: formData.get("location"),
  };
  //console.log("formData: ", formData);
  //console.log("form:", form);

  await prisma.medicines.update({
    where: {
      id: id,
    },
    data: {
      name,
      description,
      price,
      quantity,
      expiration_date,
      idCategory: category,
      idForm: form,
      packsize,
      reorder_point,
      idLocation: location,
    },
  });

  revalidatePath("/dashboard/medicine");
  redirect("/dashboard/medicine");
}

export async function deleteMedicine(id) {
  await prisma.medicines.delete({
    where: {
      id: id,
    },
  });

  revalidatePath("/dashboard/medicine");
}
