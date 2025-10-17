'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@/app/hooks/useFormValidation';
import { categorySchema } from '@/lib/schemas/category';
import { createCategory, updateCategory } from '@/app/dashboard/category/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { toast } from 'sonner';
import { SquaresPlusIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import CustomToast from '@/app/ui/components/custom-toast';

export default function CategoryForm({ category }) {
  const isEditMode = Boolean(category);
  const router = useRouter();

  const DICTIONARY_TITLE = {
    nameSingular: 'Categoría',
    create: `Crear Categoría`,
    edit: `Editar Categoría`,
    createSubtitle: `Ingresa la información de la nueva categoría`,
    editSubtitle: `Actualiza la información de la categoría`,
  };

  const getInitialData = () => {
    if (isEditMode) {
      return {
        category_name: category.category_name || '',
        category_description: category.category_description || '',
      };
    }
    return {
      category_name: '',
      category_description: '',
    };
  };

  const {
    formData,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setErrors,
  } = useForm(getInitialData(), categorySchema);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const actionToExecute = isEditMode
      ? (data) => updateCategory(category.id_category, data)
      : createCategory;

    const result = await handleSubmit(actionToExecute);

    if (result && result.success) {
      if (isEditMode) {
        toast.success(result.message || '✅ Categoría actualizada correctamente');
        router.push('/dashboard/category');
      } else {
        toast.custom(
          (t) => (
            <CustomToast
              id={t}
              message="✅ Categoría creada. ¿Deseas agregar otra?"
              onConfirm={() => reset()}
              onCancel={() => router.push('/dashboard/category')}
              confirmLabel="Sí, agregar otra"
              cancelLabel="No, ir al listado"
            />
          ),
          { duration: 10000 }
        );
      }
    } else {
      if (result.validationErrors) {
        toast.error('Por favor, corrige los errores en el formulario.');
        setErrors(result.validationErrors);
      } else {
        toast.error(result.error || '❌ Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <ResponsiveFormWrapper
      title={isEditMode ? DICTIONARY_TITLE.edit : DICTIONARY_TITLE.create}
      subtitle={isEditMode ? DICTIONARY_TITLE.editSubtitle : DICTIONARY_TITLE.createSubtitle}
      maxWidth="4xl"
    >
      <form onSubmit={handleFormSubmit}>
        <ResponsiveGrid cols={{ sm: 1, md: 1 }}>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FormInput
              label="Nombre"
              name="category_name"
              icon={SquaresPlusIcon}
              required
              value={formData.category_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category_name && errors.category_name}
              disabled={isSubmitting}
              placeholder={`Ingrese el nombre de la categoría`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FormInput
              label="Descripción"
              name="category_description"
              icon={Bars3BottomLeftIcon}
              required
              value={formData.category_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category_description && errors.category_description}
              disabled={isSubmitting}
              placeholder={`Ingrese la descripción de la categoría`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FooterForm>
              <Link href="/dashboard/category" className="btn-form-cancel">
                Cancelar
              </Link>
              <SubmitButton
                isPending={isSubmitting}
                disabled={!isValid || isSubmitting}
                loadingText={isEditMode ? 'Actualizando...' : 'Guardando...'}
              >
                {isEditMode ? 'Actualizar Categoría' : 'Crear Categoría'}
              </SubmitButton>
            </FooterForm>
          </ResponsiveField>
        </ResponsiveGrid>
      </form>
    </ResponsiveFormWrapper>
  );
}
