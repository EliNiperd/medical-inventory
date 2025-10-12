'use client';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateUser() {
  return (
    <Link href="/dashboard/user/create" className="btn-primary inline-flex items-center gap-2">
      <PlusIcon className="h-5 md:ml-2 " />
      {''}
      <span> Nuevo usuario</span>
    </Link>
  );
}
