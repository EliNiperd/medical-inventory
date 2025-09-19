
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { updateLocation } from "@/app/dashboard/location/actions";

import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Form({ location }) {
    const updateLocationWithId = updateLocation.bind(null, location.id_location);
    return (
        <form action={updateLocationWithId}>
            <div className="form-basic grid col-span-2 w-9/12 p-4 md:p-6">
                {/* Name Location */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="name_location" >
                        Nombre Ubicación
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="location_name"
                                name="location_name"
                                defaultValue={location.location_name}
                                placeholder="Ingrese el nombre de la ubicación"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción Ubicación  */}
                <div className="mb-4 col-span-2 ">
                    <label
                        htmlFor="location_description"
                    >
                        Descripción Ubicación
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="location_description"
                                name="location_description"
                                defaultValue={location.location_description}
                                placeholder="Ingrese la descripción de la ubicación"
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2">
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