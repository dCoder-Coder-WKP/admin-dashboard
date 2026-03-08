export type Size = 'small' | 'medium' | 'large';

export interface Topping {
  id: string;
  slug: string;
  name: string;
  category: string;
  prices: Record<Size, number>;
  mesh?: string;
  color?: string;
  is_active: boolean;
}

export interface Pizza {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_small: number;
  price_medium: number;
  price_large: number;
  is_active: boolean;
  is_bestseller: boolean;
  categories?: { label: string };
  updated_at: string;
}
