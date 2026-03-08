import { createSupabaseServer } from '@/lib/supabaseServer';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const supabase = await createSupabaseServer();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return <CategoriesClient categories={categories || []} />;
}
