export const OrderStatuses = ['pending', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof OrderStatuses[number];

export interface OrderItem {
  id: string;
  item_type: 'pizza' | 'extra';
  size?: 'small' | 'medium' | 'large';
  quantity: number;
  price: number;
  customization_json: Record<string, any>;
  pizzas?: { name: string };
  extras?: { name: string };
}

export interface Order {
  id: string;
  order_number: number;
  status: OrderStatus;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  order_items?: OrderItem[];
}
