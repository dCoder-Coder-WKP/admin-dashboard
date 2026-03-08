'use client';

import { useState } from 'react';
import { createCategory, updateCategory, deleteCategory } from './actions';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Check, X, Plus } from 'lucide-react';

interface CategoryRow {
  id: string;
  label: string;
  sort_order: number;
}

export default function CategoriesClient({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editSort, setEditSort] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newSort, setNewSort] = useState(categories.length);
  const [saving, setSaving] = useState(false);

  const handleEdit = (cat: CategoryRow) => {
    setEditingId(cat.id);
    setEditLabel(cat.label);
    setEditSort(cat.sort_order);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await updateCategory(editingId!, editLabel, editSort);
      toast.success('Category updated');
      setEditingId(null);
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newLabel.trim()) { toast.error('Label is required'); return; }
    setSaving(true);
    try {
      await createCategory(newLabel, newSort);
      toast.success('Category created');
      setShowAdd(false);
      setNewLabel('');
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Delete category "${label}"? Pizzas in this category will lose their association.`)) return;
    try {
      await deleteCategory(id);
      toast.success(`Category "${label}" deleted`);
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold font-serif italic text-[#E8540A]">Categories</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8540A] text-white rounded text-sm hover:bg-[#c94607] transition-colors"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>
      <p className="text-sm text-[#8C7E6A]">Manage pizza and extra categories. Changes affect dropdowns across the dashboard.</p>

      <div className="bg-white rounded border border-[#E5E5E0] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E5E5E0]">
              <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase">Label</th>
              <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase w-[100px]">Sort Order</th>
              <th className="p-4 text-xs font-medium text-[#8C7E6A] uppercase text-center w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E0] text-sm">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <td className="p-4">
                      <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)} className="w-full p-1.5 border border-[#E8540A] rounded outline-none text-sm" />
                    </td>
                    <td className="p-4">
                      <input type="number" value={editSort} onChange={(e) => setEditSort(Number(e.target.value))} className="w-full p-1.5 border border-[#E8540A] rounded outline-none text-sm" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSaveEdit} disabled={saving} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 border border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition-colors"><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-4 font-medium">{cat.label}</td>
                    <td className="p-4 text-[#8C7E6A] font-mono">{cat.sort_order}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 text-[#8C7E6A] hover:text-[#E8540A] hover:bg-orange-50 rounded transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(cat.id, cat.label)} className="p-1.5 text-[#8C7E6A] hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-[#8C7E6A]">No categories found.</td></tr>
            )}

            {/* Add Row */}
            {showAdd && (
              <tr className="bg-orange-50/30">
                <td className="p-4">
                  <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Category name" className="w-full p-1.5 border border-[#E8540A] rounded outline-none text-sm" autoFocus />
                </td>
                <td className="p-4">
                  <input type="number" value={newSort} onChange={(e) => setNewSort(Number(e.target.value))} className="w-full p-1.5 border border-[#E8540A] rounded outline-none text-sm" />
                </td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button onClick={handleAdd} disabled={saving} className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"><Check size={14} /></button>
                    <button onClick={() => setShowAdd(false)} className="p-1.5 border border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition-colors"><X size={14} /></button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
