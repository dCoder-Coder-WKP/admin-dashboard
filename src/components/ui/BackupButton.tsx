"use client";

import React from 'react';
import { Download } from 'lucide-react';

interface BackupButtonProps {
  label: string;
  description: string;
  onClick: () => void;
  loading: boolean;
}

export default function BackupButton({ label, description, onClick, loading }: BackupButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <Download size={20} className={loading ? 'animate-pulse' : ''} />
      <div className="text-left">
        <div className="font-medium text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </button>
  );
}
