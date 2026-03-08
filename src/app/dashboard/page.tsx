import { createSupabaseServer } from '@/lib/supabaseServer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createSupabaseServer();

  const { count: totalPizzas } = await supabase
    .from('pizzas')
    .select('*', { count: 'exact', head: true });

  const { count: activePizzas } = await supabase
    .from('pizzas')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { count: activeNotifications } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  const { data: configData } = await supabase
    .from('site_config')
    .select('value')
    .eq('key', 'is_open')
    .single();

  const isOpen = configData?.value === 'true';

  const { data: recentPizzas } = await supabase
    .from('pizzas')
    .select('name, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold font-serif italic mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Total Pizzas</p>
          <p className="text-3xl font-light tabular-nums">{totalPizzas ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Active Pizzas</p>
          <p className="text-3xl font-light tabular-nums">{activePizzas ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Active Notifications</p>
          <p className="text-3xl font-light tabular-nums">{activeNotifications ?? 0}</p>
        </div>
        <div className="bg-white p-6 rounded border border-[#E5E5E0] shadow-sm flex flex-col justify-between">
          <p className="text-sm text-[#8C7E6A] mb-2 uppercase tracking-wider">Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-medium">{isOpen ? 'Open Now' : 'Closed'}</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard/prices" className="px-6 py-3 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">Update Prices</Link>
          <Link href="/dashboard/pizzas/new" className="px-6 py-3 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">Add New Pizza</Link>
          <Link href="/dashboard/notifications/new" className="px-6 py-3 bg-white border border-[#E5E5E0] rounded shadow-sm hover:border-[#E8540A] hover:text-[#E8540A] transition-all text-sm font-medium">Post Notification</Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <ul className="divide-y divide-[#E5E5E0]">
             {recentPizzas?.map((pizza: any) => (
                <li key={pizza.name} className="p-4 flex justify-between items-center text-sm hover:bg-gray-50">
                  <span className="font-medium">{pizza.name}</span>
                  <span className="text-[#8C7E6A]">{new Date(pizza.updated_at).toLocaleString()}</span>
                </li>
             ))}
             {(!recentPizzas || recentPizzas.length === 0) && (
                 <li className="p-4 text-sm text-[#8C7E6A]">No recent activity.</li>
             )}
          </ul>
        </div>
      </div>
    </div>
  );
}
