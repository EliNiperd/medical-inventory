
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { updateForm } from "@/app/dashboard/form/actions";

import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Form({ form }) {
    const updateFormWithId = updateForm.bind(null, form.id_form);
    return (
        <form action={updateFormWithId}>
            <div className="form-basic grid col-span-2 w-9/12 p-4 md:p-6">
                {/* Name Form */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="name_form" >
                        Nombre Forma
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="form_name"
                                name="form_name"
                                defaultValue={form.form_name}
                                placeholder="Ingrese el nombre de la forma"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción Forma  */}
                <div className="mb-4 col-span-2 ">
                    <label
                        htmlFor="form_description"
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
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
                    <Link
                        href="/dashboard/form"
                        className="btn-form-cancel"
                    >
                        Cancelar
                    </Link>
                    <ButtonActionGuardar />
                </div>
            </div>
        </form>
    );
}