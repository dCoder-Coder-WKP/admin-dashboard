'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Order, OrderStatus } from '@/types/orders';
import SortableOrderCard from './SortableOrderCard';
import { PackageOpen } from 'lucide-react';

interface ColumnProps {
  col: { id: OrderStatus; title: string };
  orders: Order[];
}

export default function Column({ col, orders }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id: col.id });

  return (
    <div className="flex flex-col bg-gray-50 rounded border border-[#E5E5E0] w-80 shrink-0 h-[600px] overflow-hidden">
      <div className="p-4 border-b border-[#E5E5E0] bg-white shadow-sm shrink-0 flex justify-between items-center">
        <h3 className="font-semibold text-[#1A1712]">{col.title}</h3>
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">{orders.length}</span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto min-h-[200px]"
      >
        <SortableContext items={orders.map(o => o.id)} strategy={verticalListSortingStrategy}>
          {orders.map(order => (
            <SortableOrderCard key={order.id} order={order} />
          ))}
        </SortableContext>
        
        {orders.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 opacity-50">
             <PackageOpen size={40} className="mb-2" />
             <p className="text-sm">Empty column</p>
          </div>
        )}
      </div>
    </div>
  );
}
