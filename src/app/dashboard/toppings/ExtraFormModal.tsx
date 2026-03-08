'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { createExtra, updateExtra, ExtraFormData } from './actions';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExtraData {
  id: string;
  name: string;
  category_id: string;
  price: number;
  is_veg: boolean;
}

interface Category {
  id: string;
  label: string;
}

export default function ExtraFormModal({
  open,
  onClose,
  extra,
  categories,
}: {
  open: boolean;
  onClose: () => void;
  extra?: ExtraData | null;
  categories: Category[];
}) {
  const router = useRouter();
  const isEdit = !!extra;

  const [name, setName] = useState(extra?.name ?? '');
  const [categoryId, setCategoryId] = useState(extra?.category_id ?? categories[0]?.id ?? '');
  const [price, setPrice] = useState(extra?.price ?? 49);
  const [isVeg, setIsVeg] = useState(extra?.is_veg ?? true);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    const data: ExtraFormData = {
      name: name.trim(),
      category_id: categoryId,
      price,
      is_veg: isVeg,
    };
    try {
      if (isEdit) {
        await updateExtra(extra.id, data);
        toast.success('Extra updated');
      } else {
        await createExtra(data);
        toast.success('Extra created');
      }
      router.refresh();
      onClose();
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || 'Failed to save extra');
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
        <h2 className="text-xl font-bold font-serif italic text-[#E8540A] mb-6">{isEdit ? 'Edit Extra' : 'New Extra'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" placeholder="e.g. Garlic Bread" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded bg-white focus:border-[#E8540A] outline-none text-sm">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input type="number" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="extra_is_veg" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} className="w-4 h-4 accent-green-600" />
            <label htmlFor="extra_is_veg" className="text-sm font-medium">Vegetarian</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E0]">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#E5E5E0] text-[#8C7E6A] rounded hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors text-sm disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Extra' : 'Add Extra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
