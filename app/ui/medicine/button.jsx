import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteMedicine } from "@/app/dashboard/medicine/actions";

export function CreateMedicine() {
  return (
    <Link
      href="/dashboard/medicine/create"
      className="flex items-center gap-2 bg-primary-500 text-white rounded-md p-2 hover:bg-primary-600"
    >
      <span className="hidden md:block">Crear medicina</span>
      {""}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateMedicine({ id }) {
  return (
    <Link
      href={`/dashboard/medicine/${id}/edit`}
      className="bg-primary-500 text-white rounded-md p-2 hover:bg-primary-600 font-sm flex items-center "
    >
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function DeleteMedicine({ id }) {
  const deleteWithId = deleteMedicine.bind(null, id);
  return (
    <>
      <form action={deleteWithId}>
        <button className="rounded-md border bg-alert-600 p-2 hover:bg-alert-700 text-white">
          <span className="sr-only">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
