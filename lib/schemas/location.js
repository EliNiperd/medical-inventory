import { z } from 'zod';

export const locationSchema = z.object({
  location_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  location_description: z.string().min(5, 'La descripción debe tener al menos 5 caracteres'),
});
