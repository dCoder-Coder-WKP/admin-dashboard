import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Order } from '@/types/orders';

export default function SortableOrderCard({ order }: { order: Order }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: order.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const waitTimeMs = new Date().getTime() - new Date(order.created_at).getTime();
  const waitTimeMins = Math.floor(waitTimeMs / 60000);
  const isHot = waitTimeMins > 30 && order.status !== 'delivered';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded border shadow-sm cursor-grab active:cursor-grabbing flex flex-col gap-2 relative ${
        isDragging ? 'opacity-50 border-[#E8540A] scale-105 z-50' : 'border-[#E5E5E0] hover:border-gray-300'
      } ${isHot ? 'border-red-300 ring-1 ring-red-200 bg-red-50' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-center">
            <span className="font-mono font-bold text-[#E8540A]">#{order.order_number}</span>
            {isHot && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">HOT</span>}
        </div>
        <span className="text-xs text-[#8C7E6A] font-medium">{waitTimeMins}m ago</span>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-[#1A1712]">{order.customer_name}</h4>
        <p className="text-xs text-[#8C7E6A] truncate">{order.delivery_address}</p>
      </div>

      <div className="border-t border-[#E5E5E0] pt-2 mt-1">
        <ul className="text-xs space-y-1">
          {order.order_items?.map((item, idx) => (
            <li key={idx} className="flex justify-between items-start gap-2">
               <span className="text-gray-700 font-medium">
                  {item.quantity}x {item.item_type === 'pizza' ? item.pizzas?.name : item.extras?.name}
                  {item.size && <span className="text-[#8C7E6A] font-normal"> ({item.size.charAt(0).toUpperCase()})</span>}
               </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-dashed border-[#E5E5E0]">
         <span className="text-xs font-medium uppercase text-[#8C7E6A]">{order.payment_method}</span>
         <span className="font-mono font-semibold text-sm">₹{order.total_price}</span>
      </div>
    </div>
  );
}
