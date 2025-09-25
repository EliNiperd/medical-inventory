'use client';

import Link from "next/link";
import Button from "@/app/ui/button";
import { updateForm } from "@/app/dashboard/form/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/form/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/form/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form/form-input";
import { useState } from "react";
import { RectangleGroupIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

//import { ButtonActionGuardar } from "@/components/ui/button-action";

export default function Form({ form }) {
    const updateFormWithId = updateForm.bind(null, form.id_form);

    const DICTIONARY_TITLE = {
        nameSingular: 'Ubicación',
        namePlural: 'Ubicaciones'
    }

    const [formData, setFormData] = useState({
        form_name: '',
        form_description: '',
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
                    <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FormInput
                               label="Nombre"
                                name="form_name"
                                icon={RectangleGroupIcon}
                                required
                                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={form.form_name}
                                
                            />
                        </ResponsiveField>
                        <ResponsiveField span={{ sm: 1, md: 1 }} >
                            <FormInput
                                label="Descripción"
                                name="form_description"
                                icon={Bars3BottomLeftIcon}
                                required
                                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
                                defaultValue={form.form_description}
                               
                            />
                        </ResponsiveField>
                        <ResponsiveField>
                            <FooterForm>
                                <Link
                                    href="/dashboard/form"
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

                    </ResponsiveFormWrapper>


        
        </>
    );
}