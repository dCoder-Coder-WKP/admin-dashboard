import { createSupabaseServer } from '@/lib/supabaseServer';
import KanbanBoard from './KanbanBoard';
import { Order } from '@/types/orders';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createSupabaseServer();
  
  const { data: rawOrders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, item_type, size, quantity, price, customization_json,
        pizzas(name),
        extras(name)
      )
    `)
    .in('status', ['pending', 'preparing', 'out_for_delivery'])
    .order('created_at', { ascending: true });

  const orders = (rawOrders || []) as Order[];

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif italic text-[#E8540A] mb-1">Live Kitchen Board</h1>
          <p className="text-sm text-[#8C7E6A]">Real-time order synchronization. Drag cards to update statuses.</p>
        </div>
        <Link href="/dashboard/orders/history" className="px-4 py-2 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">
          View Order History
        </Link>
      </div>
      
      <div className="flex-1 min-h-[600px] overflow-x-auto">
         <KanbanBoard initialOrders={orders} />
      </div>
    </div>
  );
}
