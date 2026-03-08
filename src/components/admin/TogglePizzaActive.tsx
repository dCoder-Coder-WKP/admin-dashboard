'use client';

import { useState } from 'react';
import { togglePizzaActive } from '@/app/dashboard/pizzas/actions';
import toast from 'react-hot-toast';

export default function TogglePizzaActive({ pizzaId, initialActive }: { pizzaId: string, initialActive: boolean }) {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await togglePizzaActive(pizzaId, active);
      setActive(!active);
      toast.success(active ? 'Pizza deactivated' : 'Pizza activated');
    } catch {
      toast.error('Failed to toggle status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:ring-offset-2 disabled:opacity-50 ${
        active ? 'bg-[#16A34A]' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          active ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
