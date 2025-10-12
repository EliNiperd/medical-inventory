'use client';

import Link from 'next/link';
import { SquaresPlusIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import { updateCategory } from '@/app/dashboard/category/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm } from '@/app/hooks/useFormValidation';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { categorySchema as VALIDATION_RULES } from '@/lib/schemas/category';

export default function Category({ category }) {
  // 1️⃣ Diccionario de títulos para el formulario
  const DICTIONARY_TITLE = {
    nameSingular: 'Presentación',
    namePlural: 'Presentaciones',
  };

  // 2️⃣ Inicializar el estado con los datos del formulario
  const form = useForm(
    { category_name: category.category_name, category_description: category.category_description },
    VALIDATION_RULES
  );

  // 3️⃣ Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Declarar la referencia de la Server Action, para pasarla a handleServerAction
    const updateCategoryWithId = (formData) => updateCategory(category.id_category, formData);
    // console.log('✅ Enviando formulario:', form.formData); // 🔍 Solo para Debuggear
    // Llama a handleServerAction, pasando la Server Action correspondiente
    await form.handleServerAction(updateCategoryWithId, {
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
                name="category_name"
                icon={SquaresPlusIcon}
                required
                defaultValue={category.category_name}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.category_name}
                disabled={form.isPending}
                placeholder={`Ingrese el nombre de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FormInput
                label="Descripción"
                name="category_description"
                icon={Bars3BottomLeftIcon}
                required
                defaultValue={category.category_description}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.errors.category_description}
                disabled={form.isPending}
                placeholder={`Ingrese la descripción de la ${String(DICTIONARY_TITLE.nameSingular).toLowerCase()}`}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              <FooterForm>
                <Link href="/dashboard/form" className="btn-form-cancel">
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
