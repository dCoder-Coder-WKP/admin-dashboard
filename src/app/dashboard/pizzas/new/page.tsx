import { createSupabaseServer } from '@/lib/supabaseServer';
import PizzaForm from '@/components/admin/PizzaForm';
import { createPizza } from '../actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewPizzaPage() {
  const supabase = await createSupabaseServer();

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  const { data: toppings } = await supabase.from('toppings').select('*').eq('is_active', true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
         <Link href="/dashboard/pizzas" className="text-[#8C7E6A] hover:text-[#E8540A] text-sm">← Back</Link>
         <h1 className="text-2xl font-bold font-serif italic">Add New Pizza</h1>
      </div>
      
      <PizzaForm 
         categories={categories || []} 
         toppings={toppings || []} 
         onSubmitAction={createPizza} 
      />
    </div>
  );
}
