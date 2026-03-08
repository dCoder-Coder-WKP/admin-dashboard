'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { createTopping, updateTopping, ToppingFormData } from './actions';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ToppingData {
  id: string;
  name: string;
  category: string;
  is_veg: boolean;
  price_small: number;
  price_medium: number;
  price_large: number;
}

export default function ToppingFormModal({
  open,
  onClose,
  topping,
}: {
  open: boolean;
  onClose: () => void;
  topping?: ToppingData | null;
}) {
  const router = useRouter();
  const isEdit = !!topping;

  const [name, setName] = useState(topping?.name ?? '');
  const [category, setCategory] = useState(topping?.category ?? 'cheese');
  const [isVeg, setIsVeg] = useState(topping?.is_veg ?? true);
  const [priceSmall, setPriceSmall] = useState(topping?.price_small ?? 30);
  const [priceMedium, setPriceMedium] = useState(topping?.price_medium ?? 50);
  const [priceLarge, setPriceLarge] = useState(topping?.price_large ?? 70);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    const data: ToppingFormData = {
      name: name.trim(),
      category,
      is_veg: isVeg,
      price_small: priceSmall,
      price_medium: priceMedium,
      price_large: priceLarge,
    };
    try {
      if (isEdit) {
        await updateTopping(topping.id, data);
        toast.success('Topping updated');
      } else {
        await createTopping(data);
        toast.success('Topping created');
      }
      router.refresh();
      onClose();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to save topping');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg border border-[#E5E5E0] shadow-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8C7E6A] hover:text-[#1A1712]">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold font-serif italic text-[#E8540A] mb-6">{isEdit ? 'Edit Topping' : 'New Topping'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" placeholder="e.g. Mozzarella" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded bg-white focus:border-[#E8540A] outline-none text-sm">
              <option value="cheese">Cheese</option>
              <option value="meat">Meat</option>
              <option value="vegetable">Vegetable</option>
              <option value="sauce">Sauce</option>
              <option value="herb">Herb</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_veg" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} className="w-4 h-4 accent-green-600" />
            <label htmlFor="is_veg" className="text-sm font-medium">Vegetarian</label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-[#8C7E6A]">Small (₹)</label>
              <input type="number" min="0" value={priceSmall} onChange={(e) => setPriceSmall(Number(e.target.value))} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[#8C7E6A]">Medium (₹)</label>
              <input type="number" min="0" value={priceMedium} onChange={(e) => setPriceMedium(Number(e.target.value))} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-[#8C7E6A]">Large (₹)</label>
              <input type="number" min="0" value={priceLarge} onChange={(e) => setPriceLarge(Number(e.target.value))} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E0]">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#E5E5E0] text-[#8C7E6A] rounded hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors text-sm disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Topping' : 'Add Topping'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
