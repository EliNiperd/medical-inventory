'use client';

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteLocation } from "@/app/dashboard/location/actions";
import { Toaster, toast } from 'sonner';

export function DeleteLocation({ id_location, location_name }) {

    async function deleteClientAction(id_Location) {
        try {
            const response = await deleteLocation(id_Location);
            const { status, message } = JSON.parse(response);
            if (status === 200) {
                toast.success(`Ubicación ${location_name}, eliminada correctamente`);
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
            <button onClick={confirmDelete} className="rounded-md border bg-destructive p-2 hover:bg-destructive/70 text-primary-foreground">
                <span className="sr-only">Eliminar</span>
                <TrashIcon className="w-5" />
            </button>
            <Toaster richColors />
        </>
    );
}
