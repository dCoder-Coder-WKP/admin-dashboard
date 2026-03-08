'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

// ─── Topping Actions ───────────────────────────────────────────────

export async function toggleToppingSoldOut(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('toppings')
    .update({ is_sold_out: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
}

export interface ToppingFormData {
  name: string;
  category: string;
  is_veg: boolean;
  price_small: number;
  price_medium: number;
  price_large: number;
}

export async function createTopping(data: ToppingFormData) {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { error } = await supabaseAdmin
    .from('toppings')
    .insert({
      slug,
      name: data.name,
      category: data.category,
      is_veg: data.is_veg,
      price_small: data.price_small,
      price_medium: data.price_medium,
      price_large: data.price_large,
      is_active: true,
      is_sold_out: false,
    });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function updateTopping(id: string, data: ToppingFormData) {
  const { error } = await supabaseAdmin
    .from('toppings')
    .update({
      name: data.name,
      category: data.category,
      is_veg: data.is_veg,
      price_small: data.price_small,
      price_medium: data.price_medium,
      price_large: data.price_large,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function deleteTopping(id: string) {
  const { error } = await supabaseAdmin
    .from('toppings')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function updateToppingPrice(id: string, size: 'small' | 'medium' | 'large', price: number) {
  if (price < 0) throw new Error('Price must be 0 or greater');
  const col = size === 'small' ? 'price_small' : size === 'medium' ? 'price_medium' : 'price_large';

  const { error } = await supabaseAdmin
    .from('toppings')
    .update({ [col]: price })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

// ─── Extra Actions ─────────────────────────────────────────────────

export async function toggleExtraSoldOut(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('extras')
    .update({ is_sold_out: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
}

export interface ExtraFormData {
  name: string;
  category_id: string;
  price: number;
  is_veg: boolean;
}

export async function createExtra(data: ExtraFormData) {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { error } = await supabaseAdmin
    .from('extras')
    .insert({
      slug,
      name: data.name,
      category_id: data.category_id,
      price: data.price,
      is_veg: data.is_veg,
      is_active: true,
      is_sold_out: false,
    });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function updateExtra(id: string, data: ExtraFormData) {
  const { error } = await supabaseAdmin
    .from('extras')
    .update({
      name: data.name,
      category_id: data.category_id,
      price: data.price,
      is_veg: data.is_veg,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function deleteExtra(id: string) {
  const { error } = await supabaseAdmin
    .from('extras')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}

export async function updateExtraPrice(id: string, price: number) {
  if (price < 0) throw new Error('Price must be 0 or greater');

  const { error } = await supabaseAdmin
    .from('extras')
    .update({ price })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  revalidatePath('/dashboard/prices');
}
