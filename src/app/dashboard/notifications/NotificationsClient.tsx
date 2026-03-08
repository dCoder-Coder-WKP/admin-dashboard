'use client';

import React, { useState } from 'react';
import { Bell, AlertCircle, CalendarClock, Tag, ShieldCheck, Trash2, PowerOff, Power, Edit2 } from 'lucide-react';
import { toggleNotificationActive, deleteNotification } from './actions';
import NotificationFormModal from './NotificationFormModal';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  is_active: boolean;
  pinned: boolean;
  expires_at: string | null;
  created_at: string;
}

export default function NotificationsClient({ notifications }: { notifications: Notification[] }) {
  const router = useRouter();
  const [modal, setModal] = useState<{ open: boolean; notification: Notification | null }>({ open: false, notification: null });

  const getIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Tag className="text-pink-500" size={20} />;
      case 'event': return <CalendarClock className="text-purple-500" size={20} />;
      case 'timing': return <AlertCircle className="text-orange-500" size={20} />;
      default: return <Bell className="text-blue-500" size={20} />;
    }
  };

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      await toggleNotificationActive(id, currentState);
      toast.success(currentState ? 'Signal disabled' : 'Signal enabled');
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this signal permanently?')) return;
    try {
      await deleteNotification(id);
      toast.success('Signal deleted');
      router.refresh();
    } catch (err) {
      const e = err as { message?: string };
      toast.error(e.message || 'Failed to delete signal');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-center border-b border-[#E5E5E0] pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif italic text-[#1A1712]">Active Signals</h1>
          <p className="text-[#8C7E6A] mt-2 text-sm">Manage global banners and consumer alerts.</p>
        </div>
        <button
          onClick={() => setModal({ open: true, notification: null })}
          className="px-5 py-2.5 bg-[#E8540A] text-white rounded shadow-sm hover:bg-[#c94607] transition-colors text-sm font-medium flex gap-2 items-center"
        >
          <Bell size={16} /> Broadcast Signal
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map((note) => (
          <div key={note.id} className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${note.is_active ? 'border-[#E5E5E0]' : 'border-gray-200 opacity-60'}`}>
            <div className="flex gap-4">
              <div className={`p-3 rounded-full h-fit flex-shrink-0 ${note.is_active ? 'bg-gray-50' : 'bg-gray-100 grayscale'}`}>
                {getIcon(note.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1712]">{note.title}</h3>
                    <p className="text-sm text-[#8C7E6A] mt-1 line-clamp-2">{note.body}</p>
                  </div>
                  {note.pinned && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={12} /> Pinned
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-[#8C7E6A]">
                  <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-gray-600 font-medium">
                    Type: {note.type}
                  </span>
                  {note.expires_at && (
                    <span className="flex items-center gap-1">
                      <CalendarClock size={14} /> Exp: {new Date(note.expires_at).toLocaleDateString()}
                    </span>
                  )}
                  <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-l border-[#E5E5E0] pl-4 justify-center">
                <button
                  onClick={() => setModal({ open: true, notification: note })}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => handleToggle(note.id, note.is_active)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${note.is_active ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                >
                  {note.is_active ? <><PowerOff size={14} /> Disable</> : <><Power size={14} /> Enable</>}
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <Bell className="mx-auto h-8 w-8 text-gray-400 mb-3 opacity-50" />
            <h3 className="text-sm font-medium text-gray-900">No signals found</h3>
            <p className="text-xs text-gray-500 mt-1">Broadcast a new signal to alert consumers.</p>
          </div>
        )}
      </div>

      <NotificationFormModal
        open={modal.open}
        onClose={() => setModal({ open: false, notification: null })}
        notification={modal.notification}
      />
    </div>
  );
}
