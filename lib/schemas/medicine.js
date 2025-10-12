import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  idCategory: z.string().nonempty('Debes seleccionar una categoría').transform(Number),
  idForm: z.string().nonempty('Debes seleccionar una forma farmacéutica'),
  quantity: z.coerce
    .number({ invalid_type_error: 'La cantidad debe ser un número' })
    .min(1, 'La cantidad debe ser al menos 1'),
  packsize: z.coerce
    .number({ invalid_type_error: 'Las unidades deben ser un número' })
    .min(1, 'El tamaño del paquete debe ser al menos 1'),
  reorder_point: z.coerce
    .number({ invalid_type_error: 'El punto de reposición debe ser un número' })
    .min(0, 'El punto de reposición no puede ser negativo'),
  expiration_date: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'La fecha de caducidad debe ser posterior a la fecha actual',
  }),
  idLocation: z.string().nonempty('Debes seleccionar una ubicación'),
  price: z.coerce
    .number({ invalid_type_error: 'El precio debe ser un número' })
    .min(0, 'El precio no puede ser negativo'),
});
