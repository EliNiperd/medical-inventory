'use client';

import { PencilIcon, PlusIcon, TrashIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';

export function CreateButton({ basePath, label }) {
  return (
    <Link href={`/dashboard/${basePath}/create`} className="btn-primary">
      <span className="hidden md:block">{label}</span>
      <PlusIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function UpdateButton({ id, basePath }) {
  return (
    <Link href={`/dashboard/${basePath}/${id}/edit`} className="btn-primary">
      <span className="hidden md:block">Editar</span>
      <PencilIcon className="h-5 md:ml-2" />
    </Link>
  );
}

export function DeleteButton({ deleteAction, id, itemName, itemType }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = () =>
    toast.warning(`¿Desea eliminar ${itemType}: ${itemName}?`, {
      position: 'top-right',
      duration: Infinity,
      action: {
        label: 'Eliminar',
        onClick: () => handleDelete(),
      },
      cancel: {
        label: 'Cancelar',
      },
    });

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await deleteAction(id);
      const { status, message } = JSON.parse(response);
      if (status === 200) {
        toast.success(`${itemType} ${itemName}, eliminado correctamente.`);
      } else {
        toast.error(message || `Error al eliminar el ${itemType}.`);
      }
    } catch (error) {
      toast.error(`Error al eliminar el ${itemType}.`);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={confirmDelete}
      disabled={isDeleting}
      className={`btn-delete ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isDeleting ? (
        <ViewfinderCircleIcon className="w-5 animate-spin" />
      ) : (
        <>
          <span className="hidden md:block">Eliminar</span>
          <TrashIcon className="w-5" />
        </>
      )}
    </button>
  );
}
