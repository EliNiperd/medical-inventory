'use client';

import { TrashIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useState } from 'react';

export function DeleteButton({ deleteAction, id, itemName, itemType }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = () =>
    toast.warning(`¿Desea eliminar ${itemType.toLowerCase()}: ${itemName}?`, {
      position: 'top-right',
      duration: Infinity,
      action: {
        label: 'Eliminar',
        onClick: () => handleDelete(),
      },
      cancel: {
        label: 'Cancelar',
      },
      closeButton: false,
      //   style: {
      //     flexDirection: 'column',
      //     actionColor: 'red',
      //   },
    });

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await deleteAction(id);
      const { status, message } = JSON.parse(response);
      if (status === 200) {
        toast.success(`${itemType}: ${itemName}, eliminado correctamente.`);
      } else {
        toast.error(message || `Error al eliminar ${itemType.toLowerCase()}.`);
      }
    } catch (error) {
      toast.error(`Error al eliminar ${itemType.toLowerCase()}.`);
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
