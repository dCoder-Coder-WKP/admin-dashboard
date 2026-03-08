'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function toggleToppingSoldOut(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('toppings')
    .update({ is_sold_out: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
  // Invalidate the website cache too if possible, but the DB is the source of truth
}

export async function toggleExtraSoldOut(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('extras')
    .update({ is_sold_out: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/toppings');
}
