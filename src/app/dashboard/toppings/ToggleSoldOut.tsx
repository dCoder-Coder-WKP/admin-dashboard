'use client';

import { useState } from 'react';
import { toggleToppingSoldOut, toggleExtraSoldOut } from './actions';
import toast from 'react-hot-toast';

export default function ToggleSoldOut({ id, initialSoldOut, type }: { id: string, initialSoldOut: boolean, type: 'topping' | 'extra' }) {
  const [isSoldOut, setIsSoldOut] = useState(initialSoldOut);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (type === 'topping') {
        await toggleToppingSoldOut(id, isSoldOut);
      } else {
        await toggleExtraSoldOut(id, isSoldOut);
      }
      setIsSoldOut(!isSoldOut);
      toast.success(isSoldOut ? 'Marked as In Stock' : 'Marked as Sold Out!');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update stock status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8540A] focus:ring-offset-2 disabled:opacity-50 ${
        isSoldOut ? 'bg-red-500' : 'bg-gray-300'
      }`}
      title={isSoldOut ? "Click to mark In Stock" : "Click to mark Sold Out"}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isSoldOut ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
