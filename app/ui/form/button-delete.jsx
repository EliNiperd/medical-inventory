'use client';

import { TrashIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { deleteForm } from "@/app/dashboard/form/actions";
import { Toaster, toast } from 'sonner';
import { useState } from 'react';

export function DeleteButtonForm({ id_form, form_name }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteClientAction(id_Form) {
        setIsDeleting(true);
        try {
            const response = await deleteForm(id_Form);
            const { status, message } = JSON.parse(response);
            if (status === 200) {
                toast.success(`Forma ${form_name}, eliminada correctamente`);
                setIsDeleting(false);
            }
        } catch (error) {
            toast.error('Error al eliminar la forma');
        }
    }
    const confirmDelete = () => toast.warning(`¿Desea eliminar esta forma? ${form_name}`, {
        position: 'top-right',
        duration: Infinity,
        action: {
            label: 'Eliminar',
            onClick: () => deleteClientAction(id_form),
        },
        cancel: {
            label: 'Cancelar',
            onClick: () => console.log('Cancelar'),
        },
    });


    return (
        <>
            <button onClick={confirmDelete} disabled={isDeleting}
                className={`btn-delete ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
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
