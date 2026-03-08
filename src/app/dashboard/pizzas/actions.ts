'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { Size } from '@/types';
import { PizzaFormData } from '@/lib/validations';

export async function updatePizza(id: string, data: PizzaFormData) {
  const { error: pErr } = await supabaseAdmin
    .from('pizzas')
    .update({
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      price_small: data.price_small,
      price_medium: data.price_medium,
      price_large: data.price_large,
      is_bestseller: data.is_bestseller,
      is_spicy: data.is_spicy,
      is_active: data.is_active,
      sort_order: data.sort_order,
      image_url: data.image_url || null,
    })
    .eq('id', id);

  if (pErr) throw new Error(pErr.message);

  // Replace pizza_toppings
  await supabaseAdmin.from('pizza_toppings').delete().eq('pizza_id', id);
  if (data.toppings.length > 0) {
    const ptRows = data.toppings.map(tid => ({
      pizza_id: id,
      topping_id: tid,
    }));
    const { error: ptErr } = await supabaseAdmin.from('pizza_toppings').insert(ptRows);
    if (ptErr) throw new Error(ptErr.message);
  }

  revalidatePath('/dashboard/pizzas');
  revalidatePath('/dashboard/prices');
}

export async function createPizza(data: PizzaFormData) {
  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // 1. Insert pizza
  const { data: pizza, error: pErr } = await supabaseAdmin
    .from('pizzas')
    .insert({
      slug,
      category_id: data.category_id,
      price_small: data.price_small,
      price_medium: data.price_medium,
      price_large: data.price_large,
      is_bestseller: data.is_bestseller,
      is_spicy: data.is_spicy,
      is_active: data.is_active,
      sort_order: data.sort_order,
      image_url: data.image_url || null
    })
    .select('id')
    .single();
    
  if (pErr) throw new Error(pErr.message);
  
  // 2. Insert pizza_toppings
  if (data.toppings.length > 0) {
    const ptRows = data.toppings.map(tid => ({
       pizza_id: pizza.id,
       topping_id: tid
    }));
    const { error: ptErr } = await supabaseAdmin
      .from('pizza_toppings')
      .insert(ptRows);
      
    if (ptErr) throw new Error(ptErr.message);
  }
  
  revalidatePath('/dashboard/pizzas');
}

export async function updatePizzaPrice(id: string, size: Size, price: number) {
  if (price < 1) throw new Error('Price must be greater than 0');
  
  const col = size === 'small' ? 'price_small' : size === 'medium' ? 'price_medium' : 'price_large';
  
  const { error } = await supabaseAdmin
    .from('pizzas')
    .update({ [col]: price })
    .eq('id', id);
    
  if (error) throw error;
  
  revalidatePath('/dashboard/pizzas');
}

export async function togglePizzaActive(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('pizzas')
    .update({ is_active: !currentState })
    .eq('id', id);
    
  if (error) throw error;
  
  revalidatePath('/dashboard/pizzas');
}

export async function deletePizza(id: string) {
  const { error } = await supabaseAdmin
    .from('pizzas')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  
  revalidatePath('/dashboard/pizzas');
}
