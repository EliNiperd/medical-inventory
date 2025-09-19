
import Link from "next/link";
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { createForm } from "@/app/dashboard/form/actions";
import { ButtonActionGuardar } from "@/components/ui/button-action";

function FormCreate() {
    return (
        <form action={createForm}>
            <div className=" form-basic w-9/12 p-4">
                {/* Form Name */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="form_name" >
                        Nombre
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="form_name"
                                name="form_name"
                                placeholder="Ingrese el nombre de la forma"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción de la Forma */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="location_description" >
                        Descripción
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                type="text"
                                id="form_description"
                                name="form_description"
                                placeholder="Ingrese la descripción de la forma"
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Botones */}
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
export default FormCreate;
