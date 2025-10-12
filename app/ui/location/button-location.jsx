'use client';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
