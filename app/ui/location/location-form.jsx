'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from '@/app/hooks/useFormValidation';
import { locationSchema } from '@/lib/schemas/location';
import { createLocation, updateLocation } from '@/app/dashboard/location/actions';
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

export default function LocationForm({ location }) {
  const isEditMode = Boolean(location);
  const router = useRouter();

  const DICTIONARY_TITLE = {
    nameSingular: 'Ubicación',
    create: `Crear Ubicación`,
    edit: `Editar Ubicación`,
    createSubtitle: `Ingresa la información de la nueva ubicación`,
    editSubtitle: `Actualiza la información de la ubicación`,
  };

  const getInitialData = () => {
    if (isEditMode) {
      return {
        location_name: location.location_name || '',
        location_description: location.location_description || '',
      };
    }
    return {
      location_name: '',
      location_description: '',
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
  } = useForm(getInitialData(), locationSchema);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const actionToExecute = isEditMode
      ? (data) => updateLocation(location.id_location, data)
      : createLocation;

    const result = await handleSubmit(actionToExecute);

    if (result && result.success) {
      if (isEditMode) {
        toast.success(result.message || '✅ Ubicación actualizada correctamente');
        router.push('/dashboard/location');
      } else {
        toast.custom(
          (t) => (
            <CustomToast
              id={t}
              message="✅ Ubicación creada. ¿Deseas agregar otra?"
              onConfirm={() => reset()}
              onCancel={() => router.push('/dashboard/location')}
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
              name="location_name"
              icon={SquaresPlusIcon}
              required
              value={formData.location_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.location_name && errors.location_name}
              disabled={isSubmitting}
              placeholder={`Ingrese el nombre de la ubicación`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 2 }}>
            <FormInput
              label="Descripción"
              name="location_description"
              icon={Bars3BottomLeftIcon}
              required
              value={formData.location_description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.location_description && errors.location_description}
              disabled={isSubmitting}
              placeholder={`Ingrese la descripción de la ubicación`}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FooterForm>
              <Link href="/dashboard/location" className="btn-form-cancel">
                Cancelar
              </Link>
              <SubmitButton
                isPending={isSubmitting}
                disabled={!isValid || isSubmitting}
                loadingText={isEditMode ? 'Actualizando...' : 'Guardando...'}
              >
                {isEditMode ? 'Actualizar Ubicación' : 'Crear Ubicación'}
              </SubmitButton>
            </FooterForm>
          </ResponsiveField>
        </ResponsiveGrid>
      </form>
    </ResponsiveFormWrapper>
  );
}
