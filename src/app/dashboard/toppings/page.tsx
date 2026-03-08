import { createSupabaseServer } from '@/lib/supabaseServer';
import ToggleSoldOut from './ToggleSoldOut';

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

  return (
    <div className="max-w-6xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold font-serif italic text-[#E8540A] mb-2">Toppings Inventory</h1>
        <p className="text-sm text-[#8C7E6A] mb-6">Mark ingredients as sold out here. This instantly removes them from the Website Builder.</p>
        
        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E0]">
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Name</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Category</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-right">Sold Out?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0] text-sm md:text-base">
              {toppings?.map(topping => (
                <tr key={topping.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${topping.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {topping.name}
                  </td>
                  <td className="p-4 text-[#8C7E6A] capitalize">{topping.category}</td>
                  <td className="p-4 text-right">
                    <ToggleSoldOut 
                      id={topping.id} 
                      initialSoldOut={topping.is_sold_out} 
                      type="topping" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold font-serif italic text-[#E8540A] mb-2">Sides & Desserts</h1>
        <p className="text-sm text-[#8C7E6A] mb-6">Manage availability of Extras.</p>
        
        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E0]">
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Name</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Category</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Price</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-right">Sold Out?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0] text-sm md:text-base">
              {extras?.map(extra => (
                <tr key={extra.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${extra.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {extra.name}
                  </td>
                  <td className="p-4 text-[#8C7E6A]">{extra.categories?.label}</td>
                  <td className="p-4 font-mono">₹{extra.price}</td>
                  <td className="p-4 text-right">
                    <ToggleSoldOut 
                      id={extra.id} 
                      initialSoldOut={extra.is_sold_out} 
                      type="extra" 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
