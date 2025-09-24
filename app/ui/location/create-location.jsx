'use client';

import Link from "next/link";
import { SquaresPlusIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { createLocation } from "@/app/dashboard/location/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form-input";
import { useState } from "react";
import Button from "@/app/ui/button";


function FormCreate() {
    const DICTIONARY_TITLE = {
        nameSingular: 'Ubicación',
        namePlural: 'Ubicaciones'
    }
    // Inicializar el estado con los datos del formulario
    const [formData, setFormData] = useState({
        location_name: '',
        location_description: '',
    });

    const nameInput = useFormInput('', {
        required: true,
        minLength: 3
    }, formData);
    const descriptionInput = useFormInput('', {
        required: true,
        minLength: 3
    }, formData);

    return (
        <>
            <ResponsiveFormWrapper
                title={`Crear ${DICTIONARY_TITLE.nameSingular}`}
                subtitle={`Ingresa la información de la nueva ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                maxWidth="4xl">
                <form action={createLocation}>
                    <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FormInput
                                label="Nombre"
                                name="location_name"
                                icon={SquaresPlusIcon}
                                required
                                {...nameInput}
                                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 2 }}>
                            <FormInput
                                label="Descripción"
                                name="location_description"
                                icon={Bars3BottomLeftIcon}
                                required
                                {...descriptionInput}
                                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FooterForm>
                                <Link
                                    href="/dashboard/location"
                                    className="btn-form-cancel"
                                >
                                    Cancelar
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!nameInput.isValid || !descriptionInput.isValid}
                                >
                                    Guardar
                                </Button>
                            </FooterForm>
                        </ResponsiveField>
                    </ResponsiveGrid>
                </form>
            </ResponsiveFormWrapper>
        </>
    );
}
export default FormCreate;
