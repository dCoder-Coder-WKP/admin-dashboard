"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface RowActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export default function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Edit"
      >
        <Edit size={16} />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
