'use client';

import { TrashIcon, ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { deleteLocation } from "@/app/dashboard/location/actions";
import { Toaster, toast } from 'sonner';
import { useState } from "react";

export function DeleteLocation({ id_location, location_name }) {
    const [isDeleting, setIsDeleting] = useState(false);

    async function deleteClientAction(id_Location) {
        setIsDeleting(true);
        try {
            const response = await deleteLocation(id_Location);
            const { status, message } = JSON.parse(response);
            if (status === 200) {
                toast.success(`Ubicación ${location_name}, eliminada correctamente`);
                setIsDeleting(false);
            }
        } catch (error) {
            toast.error('Error al eliminar la ubicación');
        }
    }
    const confirmDelete = () => toast.warning(`¿Desea eliminar esta ubicación? ${location_name}`, {
        position: 'top-right',
        duration: Infinity,
        action: {
            label: 'Eliminar',
            onClick: () => deleteClientAction(id_location),
        },
        cancel: {
            label: 'Cancelar',
            onClick: () => console.log('Cancelar'),
        },
    });


    return (
        <>
            <button onClick={confirmDelete} disabled={isDeleting}
                className={`rounded-md border bg-destructive p-2 hover:bg-destructive/70 text-primary-foreground ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isDeleting ? (
                    <ViewfinderCircleIcon className="w-5 animate-spin" />
                ) : (
                    <>
                        <span className="sr-only">Eliminar</span>
                        <TrashIcon className="w-5" />
                    </>
                )}
            </button>
            <Toaster richColors />
        </>
    );
}
