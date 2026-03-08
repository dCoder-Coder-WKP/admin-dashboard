'use server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { revalidatePath } from 'next/cache';

export async function updateSiteConfig(key: string, value: string) {
  const { error } = await supabaseAdmin
    .from('site_config')
    .update({ value })
    .eq('key', key);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
}

export async function createSiteConfig(key: string, value: string, label: string, type: string) {
  if (!key.trim() || !label.trim()) throw new Error('Key and Label are required');
  const { error } = await supabaseAdmin
    .from('site_config')
    .insert({ key: key.trim(), value, label: label.trim(), type });

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/settings');
  revalidatePath('/', 'layout');
}

export async function deleteSiteConfig(key: string) {
  const { error } = await supabaseAdmin
    .from('site_config')
    .delete()
    .eq('key', key);

  if (error) throw new Error(error.message);
  revalidatePath('/dashboard/settings');
  revalidatePath('/', 'layout');
}
