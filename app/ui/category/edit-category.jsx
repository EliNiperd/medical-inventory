
import { ArchiveBoxIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { updateCategory } from "@/app/dashboard/category/actions";

import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Category({ category }) {
    const updateCategoryWithId = updateCategory.bind(null, category.id_category);
    return (
        <form action={updateCategoryWithId}>
            <div className="form-basic grid col-span-2 w-9/12 p-4 md:p-6">
                {/* Name Category */}
                <div className="mb-4 col-span-2 ">
                    <label htmlFor="category_name" >
                        Nombre Presentación
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="category_name"
                                name="category_name"
                                defaultValue={category.category_name}
                                placeholder="Ingrese el nombre de la presentación"
                                className="input-form"
                            />
                            <ArchiveBoxIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Descripción Category  */}
                <div className="mb-4 col-span-2 ">
                    <label
                        htmlFor="category_description"
                    >
                        Descripción Presentación
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="category_description"
                                name="category_description"
                                defaultValue={category.category_description}
                                placeholder="Ingrese la descripción de la presentación"
                                className="input-form"
                            />
                            <Bars3BottomLeftIcon className="icon-input" />
                        </div>
                    </div>
                </div>
                {/* Buttons */}
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