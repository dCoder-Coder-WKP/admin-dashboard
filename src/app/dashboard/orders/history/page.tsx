import { createSupabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrderHistoryPage() {
  const supabase = await createSupabaseServer();

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      id, order_number, customer_name, customer_phone, delivery_address,
      total_price, status, payment_method, payment_status, created_at,
      order_items (
        id, item_type, size, quantity, price,
        pizzas(name),
        extras(name)
      )
    `)
    .in('status', ['delivered', 'cancelled'])
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif italic text-[#E8540A]">Order History</h1>
          <p className="text-sm text-[#8C7E6A]">Completed and cancelled orders archive.</p>
        </div>
        <Link href="/dashboard/orders" className="text-[#E8540A] hover:underline text-sm font-medium">← Back to Kitchen Board</Link>
      </div>

      <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E5E0] text-xs uppercase text-[#8C7E6A] tracking-wider">
              <th className="p-4 font-medium">Order #</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium text-right">Amount</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E0] text-sm">
            {orders?.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-bold text-[#E8540A]">#{order.order_number}</td>
                <td className="p-4">
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-xs text-[#8C7E6A] truncate max-w-[200px]">{order.delivery_address}</div>
                </td>
                <td className="p-4">
                  <ul className="text-xs space-y-0.5 text-[#8C7E6A]">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {order.order_items?.slice(0, 3).map((item: any) => (
                      <li key={item.id}>{item.quantity}x {item.item_type === 'pizza' ? item.pizzas?.name : item.extras?.name}{item.size ? ` (${item.size[0].toUpperCase()})` : ''}</li>
                    ))}
                    {(order.order_items?.length || 0) > 3 && <li className="text-gray-400">+{(order.order_items?.length || 0) - 3} more</li>}
                  </ul>
                </td>
                <td className="p-4 text-right font-mono">₹{order.total_price}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-xs uppercase text-[#8C7E6A]">
                  <div>{order.payment_method}</div>
                  <div className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.payment_status}
                  </div>
                </td>
                <td className="p-4 text-right text-[#8C7E6A]">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan={7} className="p-8 text-center text-[#8C7E6A]">No completed orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
