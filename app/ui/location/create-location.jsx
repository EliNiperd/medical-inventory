
import Link from "next/link";
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { createLocation } from "@/app/dashboard/location/actions";
import { ButtonActionGuardar } from "@/components/ui/button-action";



function FormCreate() {
    return (
        <form action={createLocation}>
            <div className="grid col-span-2 rounded-md w-9/12 bg-gray-50 p-4 md:p-6">
                {/* Location Name */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="location_name" className="mb-2 block text-sm font-medium">
                        Name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="location_name"
                                name="location_name"
                                placeholder="Ingrese el nombre de la ubicación"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <ArchiveBoxIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Descripción de la Ubicación */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="location_description" className="mb-2 block text-sm font-medium">
                        Descripción
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                type="text"
                                id="location_description"
                                name="location_description"
                                placeholder="Ingrese la descripción de la ubicación"
                                className="peer block w-full h-12 rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <Bars3BottomLeftIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>
                {/* Botones */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
                    <Link
                        href="/dashboard/location"
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
export default FormCreate;
