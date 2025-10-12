'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateForm() {
  return (
    <Link href="/dashboard/form/create" className="btn-primary">
      <span className="hidden md:block">Crear Forma</span>
      {''}
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}
