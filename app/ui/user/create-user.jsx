'use client';
import Link from 'next/link';
import Button from '@/app/ui/button';
import { createUser } from '@/app/dashboard/user/actions';
import ResponsiveFormWrapper, {
  ResponsiveGrid,
  ResponsiveField,
} from '@/app/ui/components/form/responsive-form-wrapper';
import FooterForm from '@/app/ui/components/form/footer-form';
import FormInput from '@/app/ui/components/form/form-input';
import { useForm } from '@/app/hooks/useFormValidation';
import { userCreateSchema } from '@/lib/schemas/user';

export default function FormCreate() {
  //const VALIDATION_RULES = useSchemaValidation('user');
  //console.log(VALIDATION_RULES.password);

  // ✅ Hook unificado para todo el formulario al validar
  const { formData, errors, handleChange, handleBlur, validateForm, isValid } = useForm(
    {
      email: '',
      password: '',
      confirmPassword: '',
    },
    userCreateSchema
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isFormValid = validateForm();
    if (!isFormValid) {
      console.log('❌ Formulario inválido:', errors);
      return;
    }

    console.log('✅ Enviando formulario:', formData);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value);
      });

      await createUser(formDataToSubmit);
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <>
      <ResponsiveFormWrapper
        title="Crear Usuario"
        subtitle="Ingresa la información del nuevo usuario"
        maxWidth="4xl"
      >
        <form onSubmit={handleSubmit}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            {/* Email User */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                placeholder="Ingrese el email del usuario"
                className="sm:w-full md:w-1/2 lg:w-1/2"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              {/* Password User */}
              <FormInput
                label="Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                placeholder="Ingrese la contraseña del usuarioxx"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              {/* Confirm Password User */}
              <FormInput
                label="Confirmar Password"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                placeholder="Confirme la contraseña del usuario"
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
