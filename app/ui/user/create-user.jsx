"use client";
import Link from "next/link";
import Button from "@/app/ui/button";
import { createUser } from "@/app/dashboard/user/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form-input";
import { useState } from "react";


//Esquema de validación user
/*
const VALIDATION_RULES = {
  email: { required: true, email: true, type: 'email' },
  password: { required: true, min: 6 },
  confirmPassword: {
    required: true,
    min: 6,
    validate: (value, formData) => value === formData.password || "Las contraseñas no coinciden"
  },
};
*/

function FormCreate() {
 const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Usando useFormInput individual con validaciones
  const emailInput = useFormInput('', {
    required: true,
    email: true
  });

   const passwordInput = useFormInput('', {
    required: true,
    min: 6
  });

  const confirmPasswordInput = useFormInput('', {
    required: true,
    min: 6,
    validate: (value) => value === passwordInput.value || "Las contraseñas no coinciden"
  }, formData);
 
  return (
    <>
      <ResponsiveFormWrapper
        title="Crear Usuario"
        subtitle="Ingresa la información del nuevo usuario"
        maxWidth="4xl"
      >
        <form  action={createUser}  >
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }}>
            {/* Email User */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                label="Email"
                name="email"
                type="email"
                required
                {...emailInput}
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
                {...passwordInput}
                placeholder="Ingrese la contraseña del usuario"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 1 }}>
              {/* Confirm Password User */}
              <FormInput
                label="Confirmar Password"
                name="confirmPassword"
                type="password"
                required
                {...confirmPasswordInput}
                placeholder="Confirme la contraseña del usuario"
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }} >
              <FooterForm>
                <Link
                  href="/dashboard/user"
                  className="btn-form-cancel"
                >
                  Cancelar
                </Link>
                <Button 
                  type="submit" 
                   disabled={!emailInput.isValid || !passwordInput.isValid || !confirmPasswordInput.isValid}
                  
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
export default FormCreate;
