'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCorners, DragEndEvent, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Order, OrderStatus } from '@/types/orders';
import { createSupabaseBrowser } from '@/lib/supabaseBrowser';
import Column from './Column';
import { updateOrderStatus } from './actions';
import toast from 'react-hot-toast';

const COLUMNS: { id: OrderStatus; title: string }[] = [
  { id: 'pending', title: 'New Orders (Pending)' },
  { id: 'preparing', title: 'In Kitchen (Preparing)' },
  { id: 'out_for_delivery', title: 'Out for Delivery' }
];

export default function KanbanBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    // Setup Realtime Subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            // Need to fetch full order to get items, standard approach is to trust server revalidation
            // But for instant UX, we just refetch everything softly
            fetchLatestOrders();
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
          } else if (payload.eventType === 'DELETE') {
            setOrders(prev => prev.filter(o => o.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchLatestOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id, item_type, size, quantity, price, customization_json,
          pizzas(name),
          extras(name)
        )
      `)
      .in('status', ['pending', 'preparing', 'out_for_delivery'])
      .order('created_at', { ascending: true });
      
    if (data) setOrders(data as Order[]);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeOrderId = active.id as string;
    const overId = over.id as string;

    const activeOrder = orders.find(o => o.id === activeOrderId);
    if (!activeOrder) return;

    const targetStatus = COLUMNS.map(c => c.id).includes(overId as OrderStatus) 
      ? (overId as OrderStatus) 
      : orders.find(o => o.id === overId)?.status;

    if (!targetStatus || activeOrder.status === targetStatus) return;

    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, status: targetStatus } : o));

    try {
      await updateOrderStatus(activeOrderId, targetStatus);
      toast.success(`Order #${activeOrder.order_number} moved to ${targetStatus.replace('_', ' ')}`);
    } catch {
      toast.error('Failed to update status');
      // Revert
      setOrders(prev => prev.map(o => o.id === activeOrderId ? { ...o, status: activeOrder.status } : o));
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full items-start">
        {COLUMNS.map(col => (
          <Column 
            key={col.id} 
            col={col} 
            orders={orders.filter(o => o.status === col.id)} 
          />
        ))}
      </div>
    </DndContext>
  );
}
