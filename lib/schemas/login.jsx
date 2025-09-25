import { z } from 'zod';

export const schemaLogin = z.object({
  email: z.string().min(1, 'Please enter your email').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Please enter your password')
    .min(6, 'Password must be at least 6 characters long'),
});
