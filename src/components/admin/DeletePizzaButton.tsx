'use client';

import { useState } from 'react';
import { deletePizza } from '@/app/dashboard/pizzas/actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export default function DeletePizzaButton({ pizzaId, pizzaName }: { pizzaId: string; pizzaName: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${pizzaName}"? This will remove it from the menu permanently.`)) return;
    setDeleting(true);
    try {
      await deletePizza(pizzaId);
      toast.success(`"${pizzaName}" deleted`);
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete pizza');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
      title="Delete pizza"
    >
      <Trash2 size={14} />
    </button>
  );
}
