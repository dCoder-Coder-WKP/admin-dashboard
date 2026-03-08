"use server";

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function toggleNotificationActive(id: string, currentState: boolean) {
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({ is_active: !currentState })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}

export async function deleteNotification(id: string) {
  const { error } = await supabaseAdmin
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}

interface NotificationData {
  title: string;
  body: string;
  type: string;
  is_active: boolean;
  pinned: boolean;
  expires_at: string | null;
}

export async function createNotification(data: NotificationData) {
  if (!data.title.trim()) throw new Error('Title is required');
  const { error } = await supabaseAdmin
    .from('notifications')
    .insert({
      title: data.title,
      body: data.body,
      type: data.type,
      is_active: data.is_active,
      pinned: data.pinned,
      expires_at: data.expires_at,
    });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}

export async function updateNotification(id: string, data: NotificationData) {
  if (!data.title.trim()) throw new Error('Title is required');
  const { error } = await supabaseAdmin
    .from('notifications')
    .update({
      title: data.title,
      body: data.body,
      type: data.type,
      is_active: data.is_active,
      pinned: data.pinned,
      expires_at: data.expires_at,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/notifications');
  revalidatePath('/', 'layout');
}
