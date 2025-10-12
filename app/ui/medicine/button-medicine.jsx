'use client';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
