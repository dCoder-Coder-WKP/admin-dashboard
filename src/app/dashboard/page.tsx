import { createSupabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createSupabaseServer();

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  const { data: revenueData } = await supabase
    .from('orders')
    .select('total_price')
    .eq('status', 'delivered');
    
  const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

  const { count: activeOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'preparing', 'out_for_delivery']);

  const { data: configData } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'is_open')
    .single();

  const isOpen = configData?.value === 'true';

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('order_number, customer_name, total_price, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold font-serif italic mb-6 text-[#E8540A]">Live Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-light tabular-nums">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Total Orders</p>
          <p className="text-3xl font-light tabular-nums">{totalOrders ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider relative z-10">Active Tickets</p>
          <p className="text-3xl font-light tabular-nums text-[#E8540A] relative z-10">{activeOrders ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm flex flex-col justify-between">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Store Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="font-medium">{isOpen ? 'Accepting Orders' : 'Closed'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-[#8C7E6A]">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/orders" className="px-6 py-3 bg-[#E8540A] text-white rounded shadow-sm hover:bg-[#c94607] transition-colors text-sm font-medium">View Kitchen Board</Link>
          <Link href="/dashboard/pizzas/new" className="px-6 py-3 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">Add New Pizza</Link>
          <Link href="/dashboard/settings" className="px-6 py-3 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">Store Config</Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4 text-[#8C7E6A]">Recent Orders</h2>
        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E0]">
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Order #</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Customer</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Amount</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Status</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0] text-sm md:text-base">
              {recentOrders?.map((order: any) => (
                <tr key={order.order_number} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono font-medium">#{order.order_number}</td>
                  <td className="p-4">{order.customer_name}</td>
                  <td className="p-4">₹{order.total_price}</td>
                  <td className="p-4 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                  </td>
                  <td className="p-4 text-[#8C7E6A] text-right">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                  <tr><td colSpan={5} className="p-4 text-sm text-[#8C7E6A] text-center">No recent orders.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
