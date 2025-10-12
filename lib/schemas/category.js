import { z } from 'zod';

export const categorySchema = z.object({
  category_name: z.string().min(5, 'El nombre debe tener al menos 5 caracteres'),
  category_description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
});
