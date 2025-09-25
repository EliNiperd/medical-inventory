'use client';

import Link from 'next/link';
import { SquaresPlusIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { createLocation } from '@/app/dashboard/location/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm, useSchemaValidation } from '@/app/hooks/useFormValidation';
import { SubmitButton } from '@/app/ui/components/form/button-form';

function FormLocationCreate() {
  // 4️⃣ Importar las reglas de validación
  const VALIDATION_RULES = useSchemaValidation('location');

  // 1️⃣ Diccionario de títulos para el formulario
  const DICTIONARY_TITLE = {
    nameSingular: 'Ubicación',
    namePlural: 'Ubicaciones',
  };

  // 2️⃣ Inicializar el estado con los datos del formulario
  const form = useForm({ location_name: '', location_description: '' }, VALIDATION_RULES);

  // 3️⃣ Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Llama a handleServerAction, pasando la Server Action correspondiente
    await form.handleServerAction(createLocation, {
      //onSuccess: () => console.log('Usuario creado!'), // 🔍 Solo para Debuggear
      onError: (error) => console.error(`Error al crear ${DICTIONARY_TITLE.nameSingular}:`, error),
    });
  };

  return (
    <>
      <ResponsiveFormWrapper
        title={`Crear ${DICTIONARY_TITLE.nameSingular}`}
        subtitle={`Ingresa la información de la nueva ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Nombre"
                name="location_name"
                icon={SquaresPlusIcon}
                required
                value={form.location_name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.location_name}
                disabled={form.isPending}
                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Descripción"
                name="location_description"
                icon={Bars3BottomLeftIcon}
                required
                value={form.location_description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.location_description}
                disabled={form.isPending}
                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FooterForm>
                <Link href="/dashboard/location" className="btn-form-cancel">
                  Cancelar
                </Link>
                <SubmitButton
                  // Se recupera el estado 'isPending' del formulario, para desactivar el botón mientras se envía el formulario
                  isPending={form.isPending}
                  // El botón se deshabilita si el formulario no es válido o está en 'pending'
                  disabled={!form.isValid || form.isPending}
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
export default FormLocationCreate;
