'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';
import { LayoutDashboard, Pizza, ShoppingBasket, IndianRupee, Bell, Settings, LogOut, Zap, TrendingUp, Map as MapIcon, PackageOpen, Layers } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'Live Orders', icon: PackageOpen },
    { href: '/dashboard/pizzas', label: 'Pizzas', icon: Pizza },
    { href: '/dashboard/toppings', label: 'Toppings & Extras', icon: ShoppingBasket },
    { href: '/dashboard/categories', label: 'Categories', icon: Layers },
    { href: '/dashboard/iot', label: 'IoT Quality Room', icon: Zap },
    { href: '/dashboard/sentiment', label: 'Sentiment AI', icon: TrendingUp },
    { href: '/dashboard/fleet', label: 'Fleet Tracker', icon: MapIcon },
    { href: '/dashboard/prices', label: 'Pricing', icon: IndianRupee },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-[#1A1712] font-sans">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-[240px] bg-white border-r border-[#E5E5E0] flex flex-col hidden md:flex">
        <div className="h-[60px] flex items-center px-6 border-b border-[#E5E5E0]">
          <span className="font-bold text-lg text-[#E8540A]">WKP Admin</span>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={`flex items-center gap-3 px-6 py-2 text-sm transition-colors ${isActive ? 'bg-[#FFF5F0] border-l-4 border-l-[#E8540A] text-[#E8540A]' : 'text-[#8C7E6A] hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#E5E5E0]">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#8C7E6A] hover:text-[#1A1712] transition-colors w-full p-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-[60px] bg-white border-b border-[#E5E5E0] flex items-center px-6 shrink-0 z-10">
           <div className="font-medium text-sm text-[#8C7E6A] capitalize">
             {pathname.split('/').filter(Boolean).join(' / ')}
           </div>
        </header>
        <div className="flex-1 overflow-auto p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
