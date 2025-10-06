'use server';

import { wakeUpDb } from '@/app/lib/db-wake-up';
//import { getURL } from "@/lib/getURL";
import prisma from '@/app/lib/prisma';
import { parseISO } from 'date-fns';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
    idCategory,
    idForm,
    packsize,
    reorder_point,
    idLocation,
  } = {
    name: formData.name,
    description: formData.description,
    price: formData.price ? parseFloat(formData.price) : 0,
    quantity: formData.quantity ? parseInt(formData.quantity) : 1,
    expiration_date: formData.expiration_date
      ? parseISO(formData.expiration_date)
      : parseISO(new Date()),
    idCategory: formData.idCategory ? parseInt(formData.idCategory) : 1,
    idForm: formData.idForm,
    packsize: formData.packsize ? parseInt(formData.packsize) : 1,
    reorder_point: formData.reorder_point ? parseInt(formData.reorder_point) : 0,
    idLocation: formData.idLocation,
  };

  //console.log(formData);

  await prisma.medicines.create({
    data: {
      name,
      description,
      price,
      quantity,
      expiration_date,
      idCategory: idCategory,
      idForm: idForm,
      packsize,
      reorder_point,
      idLocation: idLocation,
      id_user_create: '5d743e4d-1724-4501-94d2-7d9de771cc66',
    },
  });

  revalidatePath('/dashboard/medicine');
  redirect('/dashboard/medicine');
}

export async function updateMedicine(id, formData) {
  const dataToUpdate = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price') ? parseFloat(formData.get('price')) : 0,
    quantity: formData.get('quantity') ? parseInt(formData.get('quantity')) : 1,
    expiration_date: formData.get('expiration_date')
      ? parseISO(formData.get('expiration_date'))
      : new Date(),
    idCategory: formData.get('idCategory') ? parseInt(formData.get('idCategory')) : 1,
    idForm: formData.get('idForm'),
    packsize: formData.get('packsize') ? parseInt(formData.get('packsize')) : 1,
    reorder_point: formData.get('reorder_point') ? parseInt(formData.get('reorder_point')) : 1,
    idLocation: formData.get('idLocation'),
  };

  await prisma.medicines.update({
    where: {
      id: id,
    },
    data: dataToUpdate,
  });

  revalidatePath('/dashboard/medicine');
  redirect('/dashboard/medicine');
}

export async function deleteMedicine(id) {
  await prisma.medicines.delete({
    where: {
      id: id,
    },
  });

  revalidatePath('/dashboard/medicine');
}
