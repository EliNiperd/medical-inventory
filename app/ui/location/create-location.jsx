
import Link from "next/link";
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { createLocation } from "@/app/dashboard/location/actions";
import { ButtonActionGuardar } from "@/components/ui/button-action";



function FormCreate() {
    return (
        <form action={createLocation}>
            <div className="form-basic grid col-span-2 w-9/12 p-4 md:p-6">
                {/* Location Name */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="location_name">
                        Nombre
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="location_name"
                                name="location_name"
                                placeholder="Ingrese el nombre de la ubicación"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción de la Ubicación */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="location_description" >
                        Descripción
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                type="text"
                                id="location_description"
                                name="location_description"
                                placeholder="Ingrese la descripción de la ubicación"
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Botones */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
                    <Link
                        href="/dashboard/location"
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
