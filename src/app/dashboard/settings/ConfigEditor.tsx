'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { updateSiteConfig, deleteSiteConfig } from './actions';
import { Check, X, Edit2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Config { key: string; value: string; label: string; type: string }
export default function ConfigEditor({ config }: { config: Config }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(config.value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSiteConfig(config.key, value);
      setIsEditing(false);
      toast.success(`${config.label} updated`);
    } catch {
      toast.error('Failed to update config');
      setValue(config.value); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete config "${config.label}" (${config.key})? This cannot be undone.`)) return;
    try {
      await deleteSiteConfig(config.key);
      toast.success(`Config "${config.key}" deleted`);
      router.refresh();
    } catch {
      toast.error('Failed to delete config');
    }
  };

  const renderInput = () => {
    if (config.type === 'boolean') {
      return (
        <select 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          className="p-2 border border-[#E8540A] rounded outline-none bg-white text-sm"
        >
          <option value="true">True (Yes)</option>
          <option value="false">False (No)</option>
        </select>
      );
    }

    if (config.type === 'text' && config.key === 'announcement_bar') {
      return (
        <textarea 
          value={value} 
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          className="w-full p-2 border border-[#E8540A] rounded outline-none text-sm"
        />
      );
    }

    return (
      <input 
        type={config.type === 'time' ? 'time' : config.type === 'number' ? 'number' : 'text'}
        value={value} 
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-auto p-2 border border-[#E8540A] rounded outline-none text-sm"
      />
    );
  };

  return (
    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-gray-50 transition-colors">
      <div className="md:w-1/3">
        <p className="font-medium text-sm text-[#1A1712]">{config.label}</p>
        <p className="text-xs text-[#8C7E6A] font-mono mt-1">{config.key}</p>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        {isEditing ? (
          <>
            <div className="flex-1 max-w-md">{renderInput()}</div>
            <button onClick={handleSave} disabled={isSaving} className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50">
              <Check size={16} />
            </button>
            <button onClick={() => { setIsEditing(false); setValue(config.value); }} disabled={isSaving} className="p-2 border border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <div className="flex-1 text-right">
              {config.type === 'boolean' ? (
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${value === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {value === 'true' ? 'Active' : 'Inactive'}
                </span>
              ) : (
                <span className="text-sm truncate block max-w-sm ml-auto">{value || <span className="text-gray-400 italic">Empty</span>}</span>
              )}
            </div>
            <button onClick={() => setIsEditing(true)} className="p-2 text-[#8C7E6A] hover:text-[#E8540A] hover:bg-orange-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Edit2 size={16} />
            </button>
            <button onClick={handleDelete} className="p-2 text-[#8C7E6A] hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
