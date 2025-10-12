'use client';

import Link from 'next/link';
import { RectangleGroupIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { updateForm } from '@/app/dashboard/form/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm } from '@/app/hooks/useFormValidation';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { formSchema as VALIDATION_RULES } from '@/lib/schemas/form';

export default function Form({ form }) {
  // 1️⃣ Diccionario de títulos para el formulario
  const DICTIONARY_TITLE = {
    nameSingular: 'Formulario',
    namePlural: 'Formularios',
  };

  // 2️⃣ Inicializar el estado con los datos del formulario
  const formOper = useForm(
    { form_name: form.form_name, form_description: form.form_description },
    VALIDATION_RULES
  );

  // 3️⃣ Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Declarar la referencia de la Server Action, para pasarla a handleServerAction
    const updateFormWithId = (formData) => updateForm(form.id_form, formData);
    // console.log('✅ Enviando formulario:', form.formData); // 🔍 Solo para Debuggear
    // Llama a handleServerAction, pasando la Server Action correspondiente
    await formOper.handleServerAction(updateFormWithId, {
      //onSuccess: () => console.log('Usuario creado!'), // 🔍 Solo para Debuggear
      onError: (error) => console.error(`Error al crear ${DICTIONARY_TITLE.nameSingular}:`, error),
    });
  };

  return (
    <>
      <ResponsiveFormWrapper
        title={`Editar ${DICTIONARY_TITLE.nameSingular}`}
        subtitle={`Ingresa la información de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Nombre"
                name="form_name"
                icon={RectangleGroupIcon}
                required
                defaultValue={form.form_name}
                onChange={formOper.handleChange}
                onBlur={formOper.handleBlur}
                error={formOper.errors.form_name}
                disabled={formOper.isPending}
                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Descripción"
                name="form_description"
                icon={Bars3BottomLeftIcon}
                required
                defaultValue={form.form_description}
                onChange={formOper.handleChange}
                onBlur={formOper.handleBlur}
                error={formOper.errors.form_description}
                disabled={formOper.isPending}
                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField>
              <FooterForm>
                <Link href="/dashboard/form" className="btn-form-cancel">
                  Cancelar
                </Link>
                <SubmitButton
                  // Se recupera el estado 'isPending' del formulario, para desactivar el botón mientras se envía el formulario
                  isPending={formOper.isPending}
                  // El botón se deshabilita si el formulario no es válido o está en 'pending'
                  disabled={!formOper.isValid || formOper.isPending}
                  loadingText="Guardando..."
                >
                  Guardar
                </SubmitButton>
              </FooterForm>
            </ResponsiveField>
          </ResponsiveGrid>
        </form>
      </ResponsiveFormWrapper>
    </>
  );
}
