'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@/app/hooks/useFormValidation';
import { formSchema } from '@/lib/schemas/form';
import { createForm, updateForm } from '@/app/dashboard/form/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { toast } from 'sonner';
import { RectangleGroupIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline';
import CustomToast from '@/app/ui/components/custom-toast';

export default function FormForm({ form }) {
  const isEditMode = Boolean(form);
  const router = useRouter();

  const DICTIONARY_TITLE = {
    nameSingular: 'Formulario',
    create: `Crear Formulario`,
    edit: `Editar Formulario`,
    createSubtitle: `Ingresa la información del nuevo formulario`,
    editSubtitle: `Actualiza la información del formulario`,
  };

  const getInitialData = () => {
    if (isEditMode) {
      return {
        form_name: form.form_name || '',
        form_description: form.form_description || '',
      };
    }
    return {
      form_name: '',
      form_description: '',
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
  } = useForm(getInitialData(), formSchema);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const actionToExecute = isEditMode ? (data) => updateForm(form.id_form, data) : createForm;

    const result = await handleSubmit(actionToExecute);

    if (result && result.success) {
      if (isEditMode) {
        toast.success(result.message || '✅ Formulario actualizado correctamente');
        router.push('/dashboard/form');
      } else {
        toast.custom(
          (t) => (
            <CustomToast
              id={t}
              message="✅ Formulario creado. ¿Deseas agregar otro?"
              onConfirm={() => reset()}
              onCancel={() => router.push('/dashboard/form')}
              confirmLabel="Sí, agregar otro"
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
              name="form_name"
              icon={RectangleGroupIcon}
              required
              value={formData.form_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.form_name && errors.form_name}
              disabled={isSubmitting}
              placeholder={`Ingrese el nombre del formulario`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FormInput
              label="Descripción"
              name="form_description"
              icon={Bars3BottomLeftIcon}
              required
              value={formData.form_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.form_description && errors.form_description}
              disabled={isSubmitting}
              placeholder={`Ingrese la descripción del formulario`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FooterForm>
              <Link href="/dashboard/form" className="btn-form-cancel">
                Cancelar
              </Link>
              <SubmitButton
                isPending={isSubmitting}
                disabled={!isValid || isSubmitting}
                loadingText={isEditMode ? 'Actualizando...' : 'Guardando...'}
              >
                {isEditMode ? 'Actualizar Formulario' : 'Crear Formulario'}
              </SubmitButton>
            </FooterForm>
          </ResponsiveField>
        </ResponsiveGrid>
      </form>
    </ResponsiveFormWrapper>
  );
}
