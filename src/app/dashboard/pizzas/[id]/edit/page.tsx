import { createSupabaseServer } from '@/lib/supabaseServer';
import PizzaForm from '@/components/admin/PizzaForm';
import { updatePizza } from '../../actions';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditPizzaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: pizza, error } = await supabase
    .from('pizzas')
    .select('*, pizza_toppings(topping_id)')
    .eq('id', id)
    .single();

  if (error || !pizza) return notFound();

  const { data: categories } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  const { data: toppings } = await supabase.from('toppings').select('*').eq('is_active', true);

  const initialData = {
    name: pizza.name,
    description: pizza.description || '',
    category_id: pizza.category_id,
    price_small: pizza.price_small,
    price_medium: pizza.price_medium,
    price_large: pizza.price_large,
    is_bestseller: pizza.is_bestseller,
    is_spicy: pizza.is_spicy,
    is_active: pizza.is_active,
    sort_order: pizza.sort_order || 0,
    toppings: pizza.pizza_toppings?.map((pt: { topping_id: string }) => pt.topping_id) || [],
    image_url: pizza.image_url || '',
  };

  const handleUpdate = async (data: Parameters<typeof updatePizza>[1]) => {
    'use server';
    await updatePizza(id, data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/pizzas" className="text-[#8C7E6A] hover:text-[#E8540A] text-sm">← Back</Link>
        <h1 className="text-2xl font-bold font-serif italic">Edit: {pizza.name}</h1>
      </div>

      <PizzaForm
        categories={categories || []}
        toppings={toppings || []}
        onSubmitAction={handleUpdate}
        initialData={initialData}
      />
    </div>
  );
}
