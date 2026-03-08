import { createSupabaseServer } from '@/lib/supabaseServer';
import InlinePrice from '@/components/admin/InlinePrice';
import InlineToppingPrice from '@/components/admin/InlineToppingPrice';
import InlineExtraPrice from '@/components/admin/InlineExtraPrice';

export const dynamic = 'force-dynamic';

export default async function PricesPage() {
  const supabase = await createSupabaseServer();

  const { data: pizzas } = await supabase
    .from('pizzas')
    .select('*, categories(label)')
    .order('sort_order', { ascending: true });

  const { data: toppings } = await supabase
    .from('toppings')
    .select('*')
    .order('name', { ascending: true });

  const { data: extras } = await supabase
    .from('extras')
    .select('*, categories(label)')
    .order('name', { ascending: true });

  interface BaseItem { id: string; name: string; categories?: { label: string } }
  interface Pizza extends BaseItem { price_small: number; price_medium: number; price_large: number }
  interface Topping extends BaseItem { price_small: number; price_medium: number; price_large: number }
  interface Extra extends BaseItem { price: number }

  // Group pizzas by category
  const pizzasByCategory = pizzas?.reduce((acc: Record<string, Pizza[]>, pizza) => {
    const cat = (pizza as Pizza & { categories?: { label: string } }).categories?.label || 'Uncategorized';
    acc[cat] = acc[cat] || [];
    acc[cat].push(pizza as Pizza);
    return acc;
  }, {} as Record<string, Pizza[]>) || {};

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif italic">Pricing Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* LEFT PANEL : Pizzas */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2 text-[#E8540A]">Pizzas</h2>
          {Object.entries(pizzasByCategory).map(([cat, list]) => (
             <div key={cat} className="bg-white border border-[#E5E5E0] rounded shadow-sm overflow-hidden">
               <div className="bg-gray-50 px-4 py-3 font-medium text-sm text-[#8C7E6A] border-b border-[#E5E5E0]">
                 {cat}
               </div>
               <table className="w-full text-left text-sm border-collapse">
                 <thead>
                   <tr className="border-b border-[#E5E5E0] text-xs uppercase text-[#8C7E6A] tracking-wider">
                      <th className="p-3 font-normal">Name</th>
                      <th className="p-3 font-normal text-right w-[100px]">Small</th>
                      <th className="p-3 font-normal text-right w-[100px]">Medium</th>
                      <th className="p-3 font-normal text-right w-[100px]">Large</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-[#E5E5E0]">
                   {(list as Pizza[]).map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium">{p.name}</td>
                        <td className="p-3"><InlinePrice pizzaId={p.id} size="small" initialPrice={p.price_small} /></td>
                        <td className="p-3"><InlinePrice pizzaId={p.id} size="medium" initialPrice={p.price_medium} /></td>
                        <td className="p-3"><InlinePrice pizzaId={p.id} size="large" initialPrice={p.price_large} /></td>
                      </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          ))}
        </div>

        {/* RIGHT PANEL : Toppings & Extras */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2 text-[#E8540A]">Toppings (Add on)</h2>
          <div className="bg-white border border-[#E5E5E0] rounded shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-[#E5E5E0] text-xs uppercase text-[#8C7E6A] tracking-wider">
                    <th className="p-3 font-normal">Topping</th>
                    <th className="p-3 font-normal text-right w-[100px]">Small</th>
                    <th className="p-3 font-normal text-right w-[100px]">Medium</th>
                    <th className="p-3 font-normal text-right w-[100px]">Large</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#E5E5E0]">
                 {(toppings as Topping[])?.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{t.name}</td>
                      <td className="p-3"><InlineToppingPrice toppingId={t.id} size="small" initialPrice={t.price_small} /></td>
                      <td className="p-3"><InlineToppingPrice toppingId={t.id} size="medium" initialPrice={t.price_medium} /></td>
                      <td className="p-3"><InlineToppingPrice toppingId={t.id} size="large" initialPrice={t.price_large} /></td>
                    </tr>
                 ))}
               </tbody>
             </table>
          </div>

          <h2 className="text-lg font-semibold border-b pb-2 text-[#E8540A]">Extras</h2>
          <div className="bg-white border border-[#E5E5E0] rounded shadow-sm overflow-hidden">
             <table className="w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="bg-gray-50 border-b border-[#E5E5E0] text-xs uppercase text-[#8C7E6A] tracking-wider">
                    <th className="p-3 font-normal">Item</th>
                    <th className="p-3 font-normal">Category</th>
                    <th className="p-3 font-normal text-right w-[120px]">Price</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#E5E5E0]">
                 {(extras as Extra[])?.map((e) => (
                    <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{e.name}</td>
                      <td className="p-3 text-[#8C7E6A]">{e.categories?.label}</td>
                      <td className="p-3"><InlineExtraPrice extraId={e.id} initialPrice={e.price} /></td>
                    </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
}
