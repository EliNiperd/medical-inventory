import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteLocation } from '@/app/dashboard/location/actions';

export function CreateLocation() {
  return (
    <Link href="/dashboard/location/create" className="btn-primary">
      <span className="hidden md:block">Crear ubicación</span>
      {''}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateLocation({ id_location }) {
  //console.log(id_location);
  return (
    <Link href={`/dashboard/location/${id_location}/edit`} className="btn-primary">
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function DeleteLocation({ id_location }) {
  const deleteWithId = deleteLocation.bind(null, id_location);

  const handleDelete = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta ubicación?');
    if (confirmed) {
      const form = event.target.closest('form');
      if (form) {
        form.submit();
      }
    }
  };

  return (
    <>
      <form action={deleteWithId} method="POST">
        <button onClick={handleDelete} className="btn-delete">
          <span className="hidden md:block">Eliminar</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
    </>
  );
}
