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
      <div className="form-basic  mt-6 grid grid-cols-2 w-10/12 gap-6">
        {/* User Name Full */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="name" >
            Nombre completo
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="text"
                id="user_name_full"
                name="user_name_full"
                defaultValue={user.user_name_full}
                value={user.user_name_full}
                placeholder="Ingrese el nombre completo del usuario"
                className="input-form"
              />
              <UserIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* Email  */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="description">
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
                className="input-form"
              />
              <AtSymbolIcon className="icon-input" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="mb-2">
          <label htmlFor="category" >
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={user.password}
              placeholder="Ingrese la contraseña del usuario"
              className="input-form"
            />
            <LockClosedIcon className="icon-input" />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-2">
          <label htmlFor="category" >
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              defaultValue={user.password}
              placeholder="Confirme la contraseña del usuario"
              className="input-form"
            />
            <LockClosedIcon className="icon-input" />
          </div>
        </div>

        <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
          <Link
            href="/dashboard/admin/user"
            className="btn-form-cancel"
          >
            Cancelar
          </Link>
          <Button type="submit" className="btn-form-submit">
            Guardar información
          </Button>
        </div>
      </div>
    </form>
  );
}
