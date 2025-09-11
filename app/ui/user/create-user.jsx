import Link from "next/link";
import Button from "@/app/ui/button";
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { createUser } from "@/app/dashboard/admin/user/actions";
//import { z } from "zod";
//import { useForm } from "react-hook-form";
/*import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/ui/form";
*/
function FormCreate() {
  /*
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
*/
  //const onSubmit = (data) => console.log(data);

  //console.log(watch("example")); // watch input value by passing the name of it
  return (
    <form action={createUser}>
      <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
        {/* Email User */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Ingrese el email del usuario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Password User */}
        <div className="mb-4 col-span-2 ">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Ingrese la contraseña del usuario"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Confirm Password User */}
        <div className="mb-4 col-span-2 ">
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium"
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
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <LockClosedIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
          <Link
            href="/dashboard/admin/user"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
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
