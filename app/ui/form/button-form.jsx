import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateForm() {
    return (
        <Link
            href="/dashboard/form/create"
            className="flex items-center gap-2 bg-primary/90 text-primary-foreground border-2 border-primary-500 rounded-md p-2 hover:bg-primary-600"
        >
            <span className="hidden md:block">Crear Forma</span>
            {""}
            <PlusIcon className="h-5 md:ml-2" />
        </Link>
    );
}

export function UpdateForm({ id_form }) {
    //console.log(id_location);
    return (
        <Link
            href={`/dashboard/form/${id_form}/edit`}
            className="bg-primary text-primary-foreground rounded-md p-2 hover:bg-primary/70 font-sm flex items-center "
        >
            <span className="hidden md:block">Editar</span>
            <PencilIcon className="h-5 md:ml-2" />
        </Link>
    );
}

