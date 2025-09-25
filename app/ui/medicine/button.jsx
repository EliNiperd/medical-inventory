import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteMedicine } from '@/app/dashboard/medicine/actions';

export function CreateMedicine() {
  return (
    <Link href="/dashboard/medicine/create" className="btn-primary">
      <span className="hidden md:block">Crear medicina</span>
      {''}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateMedicine({ id }) {
  return (
    <Link href={`/dashboard/medicine/${id}/edit`} className="btn-primary">
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function DeleteMedicine({ id }) {
  return (
    <>
      <form action={deleteMedicine}>
        <button className="btn-delete">
          <span className="hidden md:block">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
