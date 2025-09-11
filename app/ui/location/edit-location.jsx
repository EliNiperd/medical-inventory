
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { updateLocation } from "@/app/dashboard/location/actions";

import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Form({ location }) {
    const updateLocationWithId = updateLocation.bind(null, location.id_location);
    return (
        <form action={updateLocationWithId}>
            <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
                {/* Name Location */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="name_location" className="mb-2 block text-sm font-medium">
                        Nombre Ubicación
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="location_name"
                                name="location_name"
                                defaultValue={location.location_name}
                                placeholder="Ingrese el nombre de la ubicación"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Descripción Ubicación  */}
                <div className="mb-4 col-span-2 ">
                    <label
                        htmlFor="location_description"
                        className="mb-2 block text-sm font-medium"
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
                                className="peer block w-full h-12  rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <Bars3BottomLeftIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2">
                    <Link
                        href="/dashboard/location"
                        className="flex h-10 items-center rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-400"
                    >
                        Cancelar
                    </Link>
                    <ButtonActionGuardar />
                </div>
            </div>
        </form>
    );
}