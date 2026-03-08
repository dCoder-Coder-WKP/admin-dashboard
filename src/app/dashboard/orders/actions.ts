'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@/types/orders';

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/orders');
}

export async function deleteOrder(orderId: string) {
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId);
  
    if (error) throw new Error(error.message);
    revalidatePath('/dashboard/orders');
}
