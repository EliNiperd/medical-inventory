'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
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
