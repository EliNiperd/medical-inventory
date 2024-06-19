import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { deleteLocation } from "@/app/dashboard/location/actions";

export function CreateLocation() {
    return (
        <Link
            href="/dashboard/location/create"
            className="flex items-center gap-2 bg-primary/90 text-primary-foreground border-2 border-primary-500 rounded-md p-2 hover:bg-primary-600"
        >
            <span className="hidden md:block">Crear ubicación</span>
            {""}
            <PlusIcon className="h-5 md:ml-2" />
        </Link>
    );
}

export function UpdateLocation({ id_location }) {
    //console.log(id_location);
    return (
        <Link
            href={`/dashboard/location/${id_location}/edit`}
            className="bg-primary text-primary-foreground rounded-md p-2 hover:bg-primary/70 font-sm flex items-center "
        >
            <span className="hidden md:block">Editar</span>
            <PencilIcon className="h-5 md:ml-2" />
        </Link>
    );
}

export function DeleteLocation({ id_location }) {
    const deleteWithId = deleteLocation.bind(null, id_location);

    const handleDelete = async (event) => {
        event.preventDefault();
        const confirmed = window.confirm("¿Estás seguro de que deseas eliminar esta ubicación?");
        if (confirmed) {
            const form = event.target.closest('form');
            if (form) {
                form.submit();
            }
        }
    };

    return (
        <>
            <form action={deleteWithId} method="POST">
                <button onClick={handleDelete} className="rounded-md border bg-destructive p-2 hover:bg-destructive/70 text-primary-foreground">
                    <span className="sr-only">Eliminar</span>
                    <TrashIcon className="w-5" />
                </button>
            </form>
        </>
    );
}
