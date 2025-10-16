import { z } from 'zod';

// Esquema para la creación de un nuevo usuario
export const userCreateSchema = z
  .object({
    email: z.string().email('Por favor, ingresa un correo electrónico válido.'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula.')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.'),
    confirmPassword: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres.'),
    // Puedes añadir otros campos como 'name' o 'role' aquí si son parte del formulario de creación
    // name: z.string().min(2, 'El nombre es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'], // El error se mostrará en el campo de confirmación
  });

// Esquema para la edición de un usuario existente (con contraseña opcional)
export const userEditSchema = z
  .object({
    user_name_full: z.string().min(5, 'El nombre completo debe tener al menos 5 caracteres.'),
    email: z.string().email('Por favor, ingresa un correo electrónico válido.'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres.')
      .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula.')
      .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula.')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmPassword'],
  });
