'use client';

import Link from 'next/link';
import { useForm } from '@/app/hooks/useFormValidation';
import { userCreateSchema, userEditSchema } from '@/lib/schemas/user';
import { createUser, updateUser } from '@/app/dashboard/user/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { SubmitButton } from '@/app/ui/components/form/button-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function UserForm({ user }) {
  const isEditMode = Boolean(user);
  const router = useRouter();

  const DICTIONARY_TITLE = {
    nameSingular: 'Usuario',
    create: `Crear Usuario`,
    edit: `Editar Usuario`,
    createSubtitle: `Ingresa la información del nuevo usuario`,
    editSubtitle: `Actualiza la información del usuario`,
  };

  // Define initial data based on mode
  const getInitialData = () => {
    if (isEditMode) {
      return {
        user_name_full: user.user_name_full || '',
        email: user.email || '',
        password: '', // Passwords should not be pre-filled for security
        confirmPassword: '',
      };
    }
    return {
      user_name_full: '',
      email: '',
      password: '',
      confirmPassword: '',
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
  } = useForm(getInitialData(), isEditMode ? userEditSchema : userCreateSchema);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const actionToExecute = isEditMode ? (data) => updateUser(user.id_user, data) : createUser;

    const result = await handleSubmit(actionToExecute);

    if (result && result.success) {
      if (isEditMode) {
        toast.success(result.message || '✅ Usuario actualizado correctamente');
        router.push('/dashboard/user');
      } else {
        toast.success('✅ Usuario creado. ¿Deseas agregar otro?', {
          action: {
            label: 'Sí, agregar otro',
            onClick: () => {
              reset();
            },
          },
          cancel: {
            label: 'No, ir al listado',
            onClick: () => {
              router.push('/dashboard/user');
            },
          },
          duration: 10000, // Keep the toast open longer
        });
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
        <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
          {isEditMode && (
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="user_name_full"
                label="Nombre completo"
                type="text"
                value={formData.user_name_full}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.user_name_full && errors.user_name_full}
                placeholder="Ingrese el nombre completo"
              />
            </ResponsiveField>
          )}
          <ResponsiveField span={{ sm: 1, md: 2 }}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder="Ingrese el email"
              className="sm:w-full md:w-1/2 lg:w-1/2"
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FormInput
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              placeholder={isEditMode ? 'Dejar en blanco para no cambiar' : 'Ingrese la contraseña'}
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 1 }}>
            <FormInput
              label="Confirmar Contraseña"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && errors.confirmPassword}
              placeholder="Confirme la contraseña"
            />
          </ResponsiveField>
          <ResponsiveField span={{ sm: 1, md: 2 }}>
            <FooterForm>
              <Link href="/dashboard/user" className="btn-form-cancel">
                Cancelar
              </Link>
              <SubmitButton
                isPending={isSubmitting}
                disabled={!isValid || isSubmitting}
                loadingText={isEditMode ? 'Actualizando...' : 'Guardando...'}
              >
                {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
              </SubmitButton>
            </FooterForm>
          </ResponsiveField>
        </ResponsiveGrid>
      </form>
    </ResponsiveFormWrapper>
  );
}
