'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
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
