import { z } from 'zod';

export const schemaForm = z.object({
  form_name: z
    .string()
    .min(1, 'Please enter your form name')
    .max(100, 'Form name must be less than 100 characters long'),
});
