import { z } from "zod";

export const schemaCategory = z.object({
    category_name: z.string()
        .min(1, 'Please enter your category name')
        .max(100, 'Category name must be less than 100 characters long'),

})