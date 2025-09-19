
import Link from "next/link";
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { createCategory } from "@/app/dashboard/category/actions";
import { ButtonActionGuardar } from "@/components/ui/button-action";

function CategoryCreate() {
    return (
        <form action={createCategory}>
            <div className=" form-basic w-9/12 p-4">
                {/* Category Name */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="category_name" >
                        Nombre
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="category_name"
                                name="category_name"
                                placeholder="Ingrese el nombre de la presentación"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción de la Category */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="category_description" >
                        Descripción
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                type="text"
                                id="category_description"
                                name="category_description"
                                placeholder="Ingrese la descripción de la presentación"
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Botones */}
                <div className="col-span-2 mt-6 mr-6 flex justify-end gap-2  ">
                    <Link
                        href="/dashboard/category"
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
export default CategoryCreate;
