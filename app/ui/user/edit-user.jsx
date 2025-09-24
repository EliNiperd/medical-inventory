"use client";

import Link from "next/link";
import Button from "@/app/ui/button";
import { updateUser } from "@/app/dashboard/user/actions";
import ResponsiveFormWrapper, { ResponsiveGrid, ResponsiveField } from "@/app/ui/components/responsive-form-wrapper";
import FooterForm from "@/app/ui/components/footer-form";
import FormInput, { useFormInput } from "@/app/ui/components/form-input";
import { useState } from "react";

export default function Form({ user }) {
  const updateUserWithId = updateUser.bind(null, user.id_user);
  //const { updateMedicineWithId } = medicineEditForm;

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
        title="Editar usuario"
        subtitle="Ingresa la información del usuario"
        maxWidth="4xl"
      >
        <form action={updateUserWithId}>
          <ResponsiveGrid cols={{ sm: 1, md: 2, lg: 2 }} >
            {/* User Name */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="user_name_full"
                label="Nombre de usuario"
                type="text"
                defaultValue={user.user_name_full}
              />
            </ResponsiveField>
            {/* Email */}
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FormInput
                name="email"
                label="Email"
                type="email"
                defaultValue={user.email}
              />
            </ResponsiveField>
            {/* Password */}
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="password"
                label="Contraseña"
                type="password"
                defaultValue={user.password}
              />
            </ResponsiveField>
            {/* Confirm Password */}
            <ResponsiveField span={{ sm: 1, md: 1, lg: 1 }}>
              <FormInput
                name="confirmPassword"
                label="Confirmar Contraseña"
                type="password"
                defaultValue={user.password}
              />
            </ResponsiveField>
            <ResponsiveField span={{ sm: 1, md: 2 }}>
              <FooterForm  >
                <Link
                  href="/dashboard/user"
                  className="btn-form-cancel"
                >
                  Cancelar
                </Link>
                <Button type="submit" className="btn-form-submit">
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
