'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { createSiteConfig } from './actions';
import { Plus, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddConfigRow() {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!key.trim() || !label.trim()) {
      toast.error('Key and Label are required');
      return;
    }
    setSaving(true);
    try {
      await createSiteConfig(key, value, label, type);
      toast.success('Config added');
      setIsAdding(false);
      setKey(''); setValue(''); setLabel(''); setType('text');
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to create config');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdding) {
    return (
      <div className="p-4">
        <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 text-sm text-[#8C7E6A] hover:text-[#E8540A] transition-colors">
          <Plus size={16} /> Add New Config
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-orange-50/30 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#8C7E6A] mb-1">Key</label>
          <input value={key} onChange={(e) => setKey(e.target.value)} placeholder="e.g. my_setting" className="w-full p-2 border border-[#E8540A] rounded outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8C7E6A] mb-1">Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. My Setting" className="w-full p-2 border border-[#E8540A] rounded outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8C7E6A] mb-1">Value</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="w-full p-2 border border-[#E8540A] rounded outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#8C7E6A] mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border border-[#E8540A] rounded bg-white outline-none text-sm">
            <option value="text">Text</option>
            <option value="boolean">Boolean</option>
            <option value="number">Number</option>
            <option value="time">Time</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"><Check size={16} /></button>
        <button onClick={() => setIsAdding(false)} className="p-2 border border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition-colors"><X size={16} /></button>
      </div>
    </div>
  );
}
