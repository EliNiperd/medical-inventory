'use client';

import Link from "next/link";
import Button from "@/app/ui/button";
import { updateLocation } from "@/app/dashboard/location/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form-input";
import { useState } from "react";
import { SquaresPlusIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

//import { ButtonActionGuardar } from "@/components/ui/button-action";

export default function Form({ location }) {
    const updateLocationWithId = updateLocation.bind(null, location.id_location);

    const DICTIONARY_TITLE = {
        nameSingular: 'Ubicación',
        namePlural: 'Ubicaciones'
    }

    const [formData, setFormData] = useState({
        name_location: '',
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
                title={`Editar ${DICTIONARY_TITLE.nameSingular}`}
                subtitle={`Ingresa la información de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                maxWidth="4xl">
                <form action={updateLocationWithId}>
                    <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
                        <ResponsiveField span={{ sm: 1, md: 1 }}>
                            <FormInput
                                name="location_name"
                                label="Nombre"
                                icon={SquaresPlusIcon}
                                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={location.location_name}
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }}>
                            <FormInput
                                name="location_description"
                                label="Descripción"
                                icon={Bars3BottomLeftIcon}
                                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={location.location_description}
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }}>
                            <FooterForm>
                                <Link
                                    href="/dashboard/location"
                                    className="btn-form-cancel"
                                >
                                    Cancelar
                                </Link>
                                <Button type="submit" 
                                    disabled={!nameInput.isValid || !descriptionInput.isValid }
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