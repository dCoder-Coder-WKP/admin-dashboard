"use client";

import React from 'react';
import { Plus } from 'lucide-react';

interface SectionTableProps {
  title: string;
  description: string;
  columns: string[];
  children: React.ReactNode;
  ctaLabel?: string;
  onCreate?: () => void;
}

export default function SectionTable({ title, description, columns, children, ctaLabel, onCreate }: SectionTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        {ctaLabel && onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            {ctaLabel}
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
}
