'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(prevState, formData) {
  try {
    // La función signIn de Auth.js es lo suficientemente inteligente para manejar la redirección.
    // Solo necesita saber a dónde ir.
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirectTo: '/dashboard', // <-- ¡Esto es lo que hace la redirección!
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid credentials.' };
        case 'CallbackRouteError':
          return { message: 'Error during callback.', errors: null };
        default:
          return { message: 'Something went wrong.' };
      }
    }
    // Si el error es de tipo redirect, Auth.js lo maneja.
    throw error;
  }
}
