import { z } from "zod";

export const schemaLocation = z.object({
    location_name: z.string()
        .min(1, 'Please enter your location name')
        .max(100, 'Location name must be less than 100 characters long'),

})