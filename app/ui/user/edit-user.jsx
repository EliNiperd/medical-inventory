"use client";

import {
  UserIcon,
  AtSymbolIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Button from "@/app/ui/button";
import { updateUser } from "@/app/dashboard/admin/user/actions";

export default function Form({ user }) {
  const updateUserWithId = updateUser.bind(null, user.id_user);
  //const { updateMedicineWithId } = medicineEditForm;

  //const expirationDate = medicine.expiration_date.toISOString().split("T")[0];
  return (
    <form action={updateUserWithId}>
      <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
        {/* User Name Full */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Nombre completo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="text"
                id="user_name_full"
                name="user_name_full"
                defaultValue={user.user_name_full}
                placeholder="Ingrese el nombre completo del usuario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Email  */}
        <div className="mb-4 col-span-2 ">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={user.email}
                placeholder="Ingrese el email del usuario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={user.password}
              placeholder="Ingrese la contraseña del usuario"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-2">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={user.password}
              placeholder="Confirme la contraseña del usuario"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <LockClosedIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
          <Link
            href="/dashboard/admin/user"
            className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-400"
          >
            Cancelar
          </Link>
          <Button type="submit" className="pr-4">
            Guardar información
          </Button>
        </div>
      </div>
    </form>
  );
}
