import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateCategory() {
  return (
    <Link href="/dashboard/category/create" className="btn-primary">
      <span className="hidden md:block">Crear Presentación</span>
      {''}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateCategory({ id_category }) {
  //console.log(id_location);
  return (
    <Link href={`/dashboard/category/${id_category}/edit`} className="btn-primary">
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}
