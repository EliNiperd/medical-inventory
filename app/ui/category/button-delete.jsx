'use client';

import { TrashIcon, ViewfinderCircleIcon } from '@heroicons/react/24/outline';
import { deleteCategory } from '@/app/dashboard/category/actions';
import { Toaster, toast } from 'sonner';
import { useState } from 'react';

export function DeleteButtonCategory({ id_category, category_name }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteClientAction(id_Category) {
    setIsDeleting(true);
    try {
      const response = await deleteCategory(id_Category);
      const { status, message } = JSON.parse(response);
      if (status === 200) {
        toast.success(`Categoría ${category_name}, eliminada correctamente`);
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error('Error al eliminar la categoría');
    }
  }
  const confirmDelete = () =>
    toast.warning(`¿Desea eliminar esta categoría? ${category_name}`, {
      position: 'top-right',
      duration: Infinity,
      action: {
        label: 'Eliminar',
        onClick: () => deleteClientAction(id_category),
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => console.log('Cancelar'),
      },
    });

  return (
    <>
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
      <Toaster richColors />
    </>
  );
}
