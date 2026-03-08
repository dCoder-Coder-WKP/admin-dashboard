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

  // Next.js cache invalidation so changes reflect immediately across the site
  revalidatePath('/', 'layout');
}
