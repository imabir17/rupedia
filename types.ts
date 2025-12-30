// Enum removed to support dynamic categories

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
  weight?: string;
  stock?: number;
  reviews?: Review[];
  rating?: number;
  isPreOrder?: boolean;
  preOrderEndDate?: string; // ISO date string
  isCustomOrder?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  cartItemId: string; // Unique ID for cart item (productID + variants)
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refund Processing'
  | 'Refunded'
  | 'Return Processing'
  | 'Returned'
  | 'Exchange Processing'
  | 'Exchanged';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  city: string; // 'Inside Dhaka' | 'Outside Dhaka'
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  paymentMethod: 'COD' | 'Online Payment';
  paymentPlatform?: 'bKash' | 'Nagad';
  trxId?: string;
  status: OrderStatus;
  date: string;
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}
