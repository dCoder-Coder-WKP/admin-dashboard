import { createSupabaseServer } from '@/lib/supabaseServer';
import KanbanBoard from './KanbanBoard';
import { Order } from '@/types/orders';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createSupabaseServer();
  
  // Fetch active orders (ignore delivered/cancelled unless requested)
  // For the Kanban, it's best to show today's active workflow
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
      <div>
        <h1 className="text-2xl font-bold font-serif italic text-[#E8540A] mb-1">Live Kitchen Board</h1>
        <p className="text-sm text-[#8C7E6A]">Real-time order synchronization. Drag cards to update statuses.</p>
      </div>
      
      <div className="flex-1 min-h-[600px] overflow-x-auto">
         <KanbanBoard initialOrders={orders} />
      </div>
    </div>
  );
}
