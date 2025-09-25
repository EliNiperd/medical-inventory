'use client';

import Link from "next/link";
import Button from "@/app/ui/button";
import { updateCategory } from "@/app/dashboard/category/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/form/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/form/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form/form-input";
import { useState } from "react";
import { SquaresPlusIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

//import { ButtonActionGuardar } from "@/components/ui/button-action";


export default function Category({ category }) {

    const DICTIONARY_TITLE = {
        nameSingular: 'Presentación',
        namePlural: 'Presentaciones'
    }

    const [formData, setFormData] = useState({
        category_name: category.category_name,
        category_description: category.category_description,
    });

    const nameInput = useFormInput(category.category_name, {
        required: true,
        minLength: 3
    }, formData);

    const descriptionInput = useFormInput(category.category_description, {
        required: true,
        minLength: 3
    }, formData);

    const updateCategoryWithId = updateCategory.bind(null, category.id_category);
    return (
        <>
            <ResponsiveFormWrapper
                title={`Editar ${DICTIONARY_TITLE.nameSingular}`}
                subtitle={`Ingresa la información de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                maxWidth="4xl"
            >
                <form action={updateCategoryWithId}>
                    <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FormInput
                                label="Nombre"
                                name="category_name"
                                icon={SquaresPlusIcon}
                                required
                                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={category.category_name}

                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FormInput
                                label="Descripción"
                                name="category_description"
                                icon={Bars3BottomLeftIcon}
                                required
                                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={category.category_description}
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }}>
                            <FooterForm>
                                <Link
                                    href="/dashboard/form"
                                    className="btn-form-cancel"
                                >
                                    Cancelar
                                </Link>
                                <Button type="submit"
                                    disabled={!nameInput.isValid || !descriptionInput.isValid}
                                >
                                    Guardar
                                </Button>
                            </FooterForm>
                        </ResponsiveField>
                    </ResponsiveGrid>
                </ form>
            </ResponsiveFormWrapper>
        </>
    );
}