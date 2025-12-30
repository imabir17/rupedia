export enum Category {
  HOME_DECOR = 'Home Decor',
  STATIONERY = 'Stationery',
  ORNAMENTS = 'Ornaments',
  MAKEUP = 'Makeup',
}

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name-asc';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isFeatured: boolean;
  colors?: string[]; // Hex codes or names
  sizes?: string[];
  reviews?: Review[];
  rating?: number;
  isPreOrder?: boolean;
  isCustomOrder?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
