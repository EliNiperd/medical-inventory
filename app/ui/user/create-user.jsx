import Link from "next/link";
import Button from "@/app/ui/button";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { createUser } from "@/app/dashboard/admin/user/actions";

function FormCreate() {
 
  return (
    <form action={createUser}>
      <div className="form-basic grid col-span-2 w-9/12 p-4 md:p-6">
        {/* Email User */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="name" >
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingrese el email del usuario"
                className="input-form"
              />
              <AtSymbolIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* Password User */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="password" >
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingrese la contraseña del usuario"
                className="input-form"
              />
              <LockClosedIcon className="icon-input" />
            </div>
          </div>
        </div>
        {/* Confirm Password User */}
        <div className="mb-4 col-span-2 ">
          <label
            htmlFor="confirmPassword"
          >
            Confirmar Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirme la contraseña del usuario"
                className="input-form"
              />
              <LockClosedIcon className="icon-input" />
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2">
          <Link
            href="/dashboard/admin/user"
            className="btn-form-cancel"
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
export default FormCreate;
