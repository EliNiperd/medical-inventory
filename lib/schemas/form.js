import { z } from 'zod';

export const formSchema = z.object({
  form_name: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  form_description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});
