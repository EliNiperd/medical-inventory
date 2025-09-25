'use client';

import Link from 'next/link';
import Button from '@/app/ui/button';
import { updateUser } from '@/app/dashboard/user/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm, useSchemaValidation } from '@/app/hooks/useFormValidation';

export default function Form({ user }) {
  const updateUserWithId = updateUser.bind(null, user.id_user);

  // 4️⃣ Importar las reglas de validación
  const VALIDATION_RULES = useSchemaValidation('userEdit');

  // ✅ Se utiliza el hook useForm PERSONALIZADO para validar todo el formulario al enviarlo
  const { formData, errors, handleChange, handleBlur, validateForm, isValid } = useForm(
    {
      user_name_full: user.user_name_full,
      email: user.email,
      password: user.password,
      confirmPassword: user.password,
    },
    VALIDATION_RULES
  );

  // ✅ handleSubmit - Menejador de envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    //console.log("✅ Enviando formulario:", formData, "isFormValid:", isFormValid);
    if (!isFormValid) {
      console.log('❌ Formulario inválido:', errors);
      return;
    }
    //console.log("✅ Enviando formulario:", formData);
    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });
      await updateUserWithId(formDataToSubmit);
    } catch (error) {
      console.error('Error al actualizar - usuario:', error);
    }
  };

  return (
    <>
      <ResponsiveFormWrapper
        title="Editar usuario"
        subtitle="Ingresa la información del usuario"
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            {/* User Name */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="user_name_full"
                label="Nombre completo"
                type="text"
                value={formData.user_name_full}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.user_name_full}
              />
            </ResponsiveField>
            {/* Email */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={errors.email}
              />
            </ResponsiveField>
            {/* Password */}
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
              />
            </ResponsiveField>
            {/* Confirm Password */}
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FooterForm>
                <Link href="/dashboard/user" className="btn-form-cancel">
                  Cancelar
                </Link>
                <Button
                  type="submit"
                  disabled={!isValid}
                  className={!isValid ? 'opacity-50 cursor-not-allowed' : ''}
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
