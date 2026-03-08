'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function createCategory(label: string, sortOrder: number) {
  if (!label.trim()) throw new Error('Label is required');
  const { error } = await supabaseAdmin
    .from('categories')
    .insert({ label: label.trim(), sort_order: sortOrder });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/pizzas');
}

export async function updateCategory(id: string, label: string, sortOrder: number) {
  if (!label.trim()) throw new Error('Label is required');
  const { error } = await supabaseAdmin
    .from('categories')
    .update({ label: label.trim(), sort_order: sortOrder })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/pizzas');
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/pizzas');
}
