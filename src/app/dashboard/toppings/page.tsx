import { createSupabaseServer } from '@/lib/supabaseServer';
import ToppingsExtrasClient from './ToppingsExtrasClient';

export const dynamic = 'force-dynamic';

export default async function ToppingsAndExtrasPage() {
  const supabase = await createSupabaseServer();
  
  const { data: toppings } = await supabase
    .from('toppings')
    .select('*')
    .order('category')
    .order('name');

  const { data: extras } = await supabase
    .from('extras')
    .select('*, categories(label)')
    .order('category_id')
    .order('name');

  const { data: categories } = await supabase
    .from('categories')
    .select('id, label')
    .order('sort_order');

  return (
    <ToppingsExtrasClient
      toppings={toppings || []}
      extras={extras || []}
      categories={categories || []}
    />
  );
}
