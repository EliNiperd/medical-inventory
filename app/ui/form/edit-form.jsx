
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { updateForm } from "@/app/dashboard/form/actions";

import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Form({ form }) {
    const updateFormWithId = updateForm.bind(null, form.id_form);
    return (
        <form action={updateFormWithId}>
            <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
                {/* Name Form */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="name_form" className="mb-2 block text-sm font-medium">
                        Nombre Forma
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="form_name"
                                name="form_name"
                                defaultValue={form.form_name}
                                placeholder="Ingrese el nombre de la forma"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Descripción Forma  */}
                <div className="mb-4 col-span-2 ">
                    <label
                        htmlFor="form_description"
                        className="mb-2 block text-sm font-medium"
                    >
                        Descripción Forma
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="form_description"
                                name="form_description"
                                defaultValue={form.form_description}
                                placeholder="Ingrese la descripción de la forma"
                                className="peer block w-full h-12  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <Bars3BottomLeftIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
                    <Link
                        href="/dashboard/form"
                        className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-grary-200"
                    >
                        Cancelar
                    </Link>
                    <ButtonActionGuardar />
                </div>
            </div>
        </form>
    );
}