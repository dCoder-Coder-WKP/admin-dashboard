import * as z from 'zod';

export const pizzaSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().uuid('Invalid category'),
  price_small: z.number().min(1, 'Price must be greater than 0'),
  price_medium: z.number().min(1, 'Price must be greater than 0'),
  price_large: z.number().min(1, 'Price must be greater than 0'),
  is_bestseller: z.boolean(),
  is_spicy: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number(),
  toppings: z.array(z.string()),
});

export type PizzaFormData = z.infer<typeof pizzaSchema>;
