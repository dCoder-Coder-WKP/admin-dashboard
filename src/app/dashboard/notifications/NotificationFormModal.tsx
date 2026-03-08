'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { createNotification, updateNotification } from './actions';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationData {
  id: string;
  title: string;
  body: string;
  type: string;
  is_active: boolean;
  pinned: boolean;
  expires_at: string | null;
}

export default function NotificationFormModal({
  open,
  onClose,
  notification,
}: {
  open: boolean;
  onClose: () => void;
  notification?: NotificationData | null;
}) {
  const router = useRouter();
  const isEdit = !!notification;

  const [title, setTitle] = useState(notification?.title ?? '');
  const [body, setBody] = useState(notification?.body ?? '');
  const [type, setType] = useState(notification?.type ?? 'info');
  const [isActive, setIsActive] = useState(notification?.is_active ?? true);
  const [pinned, setPinned] = useState(notification?.pinned ?? false);
  const [expiresAt, setExpiresAt] = useState(notification?.expires_at?.split('T')[0] ?? '');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    const data = {
      title: title.trim(),
      body: body.trim(),
      type,
      is_active: isActive,
      pinned,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    };
    try {
      if (isEdit) {
        await updateNotification(notification.id, data);
        toast.success('Notification updated');
      } else {
        await createNotification(data);
        toast.success('Signal broadcast!');
      }
      router.refresh();
      onClose();
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || 'Failed to save notification');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg border border-[#E5E5E0] shadow-xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#8C7E6A] hover:text-[#1A1712]">
          <X size={18} />
        </button>
        <h2 className="text-xl font-bold font-serif italic text-[#E8540A] mb-6">{isEdit ? 'Edit Signal' : 'Broadcast New Signal'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" placeholder="e.g. Weekend Special!" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" placeholder="Notification content..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded bg-white focus:border-[#E8540A] outline-none text-sm">
                <option value="info">Info</option>
                <option value="offer">Offer</option>
                <option value="event">Event</option>
                <option value="timing">Timing</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expires On</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full p-2 border border-[#E5E5E0] rounded focus:border-[#E8540A] outline-none text-sm" />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#E8540A]" />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="w-4 h-4 accent-amber-500" />
              Pinned
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#E5E5E0]">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#E5E5E0] text-[#8C7E6A] rounded hover:bg-gray-50 transition-colors text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-[#E8540A] text-white rounded hover:bg-[#c94607] transition-colors text-sm disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Signal' : 'Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
