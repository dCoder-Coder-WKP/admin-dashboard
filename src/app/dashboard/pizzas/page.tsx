import { createSupabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';
import InlinePrice from '@/components/admin/InlinePrice';
import TogglePizzaActive from '@/components/admin/TogglePizzaActive';
import DeletePizzaButton from '@/components/admin/DeletePizzaButton';

export const dynamic = 'force-dynamic';

export default async function PizzasPage() {
  const supabase = await createSupabaseServer();

  const { data: pizzas } = await supabase
    .from('pizzas')
    .select('*, categories(label)')
    .order('sort_order', { ascending: true });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-serif italic">Pizzas</h1>
        <Link href="/dashboard/pizzas/new" className="bg-[#E8540A] text-white px-4 py-2 rounded text-sm hover:bg-[#cc4909] transition-colors">
          Add New Pizza
        </Link>
      </div>

      <div className="bg-white border border-[#E5E5E0] rounded shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E5E0] text-xs uppercase text-[#8C7E6A] tracking-wider">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Small (₹)</th>
              <th className="p-4 font-medium text-right">Medium (₹)</th>
              <th className="p-4 font-medium text-right">Large (₹)</th>
              <th className="p-4 font-medium text-center">Active</th>
              <th className="p-4 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E0]">
            {pizzas?.map((pizza) => (
              <tr key={pizza.id} className="text-sm hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="font-medium text-[#1A1712]">{pizza.name}</span>
                  {pizza.is_bestseller && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full uppercase">Best</span>}
                </td>
                <td className="p-4 text-[#8C7E6A]">{pizza.categories?.label}</td>
                <td className="p-4">
                  <InlinePrice pizzaId={pizza.id} size="small" initialPrice={pizza.price_small} />
                </td>
                <td className="p-4">
                  <InlinePrice pizzaId={pizza.id} size="medium" initialPrice={pizza.price_medium} />
                </td>
                <td className="p-4">
                  <InlinePrice pizzaId={pizza.id} size="large" initialPrice={pizza.price_large} />
                </td>
                <td className="p-4 text-center">
                   <TogglePizzaActive pizzaId={pizza.id} initialActive={pizza.is_active} />
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <Link href={`/dashboard/pizzas/${pizza.id}/edit`} className="text-[#E8540A] hover:underline text-sm">Edit</Link>
                    <DeletePizzaButton pizzaId={pizza.id} pizzaName={pizza.name} />
                  </div>
                </td>
              </tr>
            ))}
            {(!pizzas || pizzas.length === 0) && (
                <tr><td colSpan={7} className="p-8 text-center text-[#8C7E6A]">No pizzas found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
