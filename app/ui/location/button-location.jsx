'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
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
