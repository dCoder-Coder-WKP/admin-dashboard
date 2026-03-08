"use server";

import { createSupabaseServer } from '@/lib/supabaseServer';
import { revalidatePath } from 'next/cache';

export async function toggleNotificationActive(id: string, currentState: boolean, formData?: FormData) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from('notifications')
    .update({ is_active: !currentState })
    .eq('id', id);

  if (error) {
    console.error('Failed to toggle notification status:', error);
  }

  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}

export async function deleteNotification(id: string, formData?: FormData) {
  const supabase = await createSupabaseServer();
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Failed to delete notification:', error);
  }

  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}
