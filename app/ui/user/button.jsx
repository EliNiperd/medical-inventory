import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteUser } from '@/app/dashboard/user/actions';

export function CreateUser() {
  return (
    <Link href="/dashboard/user/create" className="btn-primary inline-flex items-center gap-2">
      <PlusIcon className="h-5 md:ml-2 " />
      {''}
      <span> Nuevo usuario</span>
    </Link>
  );
}

export function UpdateUser({ id }) {
  return (
    <Link href={`/dashboard/user/${id}/edit`} className="btn-primary">
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
        <button className="btn-delete">
          <span className="hidden md:block">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
