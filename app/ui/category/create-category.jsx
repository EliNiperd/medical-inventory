'use client';

import Link from 'next/link';
import { SquaresPlusIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { createCategory } from '@/app/dashboard/category/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm, useSchemaValidation } from '@/app/hooks/useFormValidation';
import { SubmitButton } from '@/app/ui/components/form/button-form';

//import { ButtonActionGuardar } from "@/components/ui/button-action";

function CategoryCreate() {
  // 4️⃣ Importar las reglas de validación
  const VALIDATION_RULES = useSchemaValidation('category');

  // 1️⃣ Diccionario de títulos para el formulario
  const DICTIONARY_TITLE = {
    nameSingular: 'Presentación',
    namePlural: 'Presentaciones',
  };

  // 2️⃣ Inicializar el estado con los datos del formulario
  const form = useForm({ category_name: '', category_description: '' }, VALIDATION_RULES);

  // 3️⃣ Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Llama a handleServerAction, pasando la Server Action correspondiente
    await form.handleServerAction(createCategory, {
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
                name="category_name"
                icon={SquaresPlusIcon}
                required
                value={form.category_name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.category_name}
                disabled={form.isSubmitting}
                placeholder={`Ingrese el nombre de la ${DICTIONARY_TITLE.nameSingular}`}
              />
            </ResponsiveField>

            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Descripción"
                name="category_description"
                icon={Bars3BottomLeftIcon}
                required
                value={form.category_description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.category_description}
                disabled={form.isSubmitting}
                placeholder={`Ingrese la descripción de la ${DICTIONARY_TITLE.nameSingular}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FooterForm>
                <Link href="/dashboard/category" className="btn-form-cancel">
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
export default CategoryCreate;
