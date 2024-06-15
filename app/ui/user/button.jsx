import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteUser } from "@/app/dashboard/admin/user/actions";

export function CreateUser() {
  return (
    <Link
      href="/dashboard/admin/user/create"
      className="flex items-center gap-2 bg-primary/90 text-primary-foreground border-2 border-primary-500 rounded-md p-2 hover:bg-primary-600"
    >
      <span className="hidden md:block">Crear user</span>
      {""}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateUser({ id }) {
  return (
    <Link
      href={`/dashboard/admin/user/${id}/edit`}
      className="bg-primary text-primary-foreground rounded-md p-2 hover:bg-primary/70 font-sm flex items-center "
    >
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function DeleteUser({ id }) {
  const deleteWithId = deleteUser.bind(null, id);
  return (
    <>
      <form action={deleteWithId}>
        <button className="rounded-md border bg-destructive p-2 hover:bg-destructive/70 text-primary-foreground">
          <span className="sr-only">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
