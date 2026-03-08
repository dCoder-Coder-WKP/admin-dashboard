'use client';

import { useState } from 'react';
import ToggleSoldOut from './ToggleSoldOut';
import ToppingFormModal from './ToppingFormModal';
import ExtraFormModal from './ExtraFormModal';
import { deleteTopping, deleteExtra } from './actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface ToppingRow {
  id: string;
  name: string;
  category: string;
  is_veg: boolean;
  is_sold_out: boolean;
  price_small: number;
  price_medium: number;
  price_large: number;
}

interface ExtraRow {
  id: string;
  name: string;
  category_id: string;
  price: number;
  is_veg: boolean;
  is_sold_out: boolean;
  categories?: { label: string };
}

interface Category {
  id: string;
  label: string;
}

export default function ToppingsExtrasClient({
  toppings,
  extras,
  categories,
}: {
  toppings: ToppingRow[];
  extras: ExtraRow[];
  categories: Category[];
}) {
  const router = useRouter();
  const [toppingModal, setToppingModal] = useState<{ open: boolean; topping: ToppingRow | null }>({ open: false, topping: null });
  const [extraModal, setExtraModal] = useState<{ open: boolean; extra: ExtraRow | null }>({ open: false, extra: null });

  const handleDeleteTopping = async (id: string, name: string) => {
    if (!confirm(`Delete topping "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTopping(id);
      toast.success(`Topping "${name}" deleted`);
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete topping');
    }
  };

  const handleDeleteExtra = async (id: string, name: string) => {
    if (!confirm(`Delete extra "${name}"? This cannot be undone.`)) return;
    try {
      await deleteExtra(id);
      toast.success(`Extra "${name}" deleted`);
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete extra');
    }
  };

  return (
    <div className="max-w-6xl space-y-10">
      {/* ─── Toppings Section ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold font-serif italic text-[#E8540A]">Toppings Inventory</h1>
          <button
            onClick={() => setToppingModal({ open: true, topping: null })}
            className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded text-sm hover:bg-[#c94607] transition-colors"
          >
            <Plus size={16} /> Add Topping
          </button>
        </div>
        <p className="text-sm text-[#8C7E6A] mb-6">Mark ingredients as sold out, or add/edit/remove toppings.</p>

        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E0]">
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Name</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Category</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-right">Prices (S/M/L)</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-center">Sold Out?</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0] text-sm md:text-base">
              {toppings.map((topping) => (
                <tr key={topping.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${topping.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {topping.name}
                  </td>
                  <td className="p-4 text-[#8C7E6A] capitalize">{topping.category}</td>
                  <td className="p-4 text-right font-mono text-[#8C7E6A]">
                    ₹{topping.price_small} / ₹{topping.price_medium} / ₹{topping.price_large}
                  </td>
                  <td className="p-4 text-center">
                    <ToggleSoldOut id={topping.id} initialSoldOut={topping.is_sold_out} type="topping" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setToppingModal({ open: true, topping })} className="p-1.5 text-[#8C7E6A] hover:text-[#E8540A] hover:bg-orange-50 rounded transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteTopping(topping.id, topping.name)} className="p-1.5 text-[#8C7E6A] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {toppings.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#8C7E6A]">No toppings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Extras Section ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold font-serif italic text-[#E8540A]">Sides & Desserts</h1>
          <button
            onClick={() => setExtraModal({ open: true, extra: null })}
            className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded text-sm hover:bg-[#c94607] transition-colors"
          >
            <Plus size={16} /> Add Extra
          </button>
        </div>
        <p className="text-sm text-[#8C7E6A] mb-6">Manage availability and details of Extras.</p>

        <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E5E0]">
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Name</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Category</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Price</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-center">Sold Out?</th>
                <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E0] text-sm md:text-base">
              {extras.map((extra) => (
                <tr key={extra.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${extra.is_veg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {extra.name}
                  </td>
                  <td className="p-4 text-[#8C7E6A]">{extra.categories?.label}</td>
                  <td className="p-4 font-mono">₹{extra.price}</td>
                  <td className="p-4 text-center">
                    <ToggleSoldOut id={extra.id} initialSoldOut={extra.is_sold_out} type="extra" />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setExtraModal({ open: true, extra })} className="p-1.5 text-[#8C7E6A] hover:text-[#E8540A] hover:bg-orange-50 rounded transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteExtra(extra.id, extra.name)} className="p-1.5 text-[#8C7E6A] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {extras.length === 0 && (
                <tr><td colSpan={5} className="p-8 text-center text-[#8C7E6A]">No extras found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modals ─── */}
      <ToppingFormModal
        open={toppingModal.open}
        onClose={() => setToppingModal({ open: false, topping: null })}
        topping={toppingModal.topping}
      />
      <ExtraFormModal
        open={extraModal.open}
        onClose={() => setExtraModal({ open: false, extra: null })}
        extra={extraModal.extra}
        categories={categories}
      />
    </div>
  );
}
