// Enum removed to support dynamic categories

export type SortOption = 'popularity' | 'price-asc' | 'price-desc' | 'name-asc';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export type ProductType = 'regular' | 'pre-order' | 'custom';
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>; // e.g., { Color: 'Red', Size: 'M' }
  image?: string;
}

export interface SEOData {
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  ogImage?: string;
}

export interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'file';
  options?: string[]; // For select type
  required: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  type: ProductType;
  status: ProductStatus;
  category: string;
  subCategory?: string;
  brand?: string;
  tags?: string[];

  description: string;
  shortDescription?: string;

  price: number;
  originalPrice?: number;
  costPrice?: number;

  images: string[]; // First image is featured

  stock: number;
  trackQuantity: boolean;
  lowStockThreshold?: number;

  weight?: string;
  dimensions?: string; // e.g. "10x20x5 cm"

  variants: ProductVariant[];
  options: { name: string; values: string[] }[]; // e.g. [{name: 'Color', values: ['Red', 'Blue']}]

  // Pre-Order Specific
  preOrderStart?: string;
  preOrderEnd?: string;
  shippingDate?: string;
  depositAmount?: number;

  // Custom Order Specific
  customFields?: CustomField[];
  productionTime?: string; // e.g. "7-14 days"

  seo?: SEOData;

  isFeatured: boolean;
  rating?: number;
  reviews?: Review[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariantId?: string;
  selectedOptions?: Record<string, string>; // e.g. { Color: 'Red' }
  customInputs?: Record<string, string>; // For custom orders
  cartItemId: string;
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

export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';
export type FulfillmentStatus = 'unfulfilled' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
export type OrderType = 'regular' | 'pre-order' | 'custom' | 'mixed';

export interface OrderLog {
  id: string;
  date: string;
  action: string;
  note?: string;
  userId?: string; // Author of the action
}

export interface CancellationRequest {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  reason: string;
  transactionId?: string;
  address?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  date: string;
}

export interface OrderAddress {
  address: string;
  city: string;
  zipCode?: string;
  country?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
}

export interface Order {
  id: string; // Internal ID
  orderNumber: string; // Friendly ID e.g. ORD-1001

  type: OrderType;

  customer: CustomerDetails;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;

  items: CartItem[];

  // Financials
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;

  paymentMethod: 'COD' | 'Online Payment';
  paymentStatus: PaymentStatus;

  fulfillmentStatus: FulfillmentStatus;

  // Tracking & Timeline
  timeline: OrderLog[];
  trackingNumber?: string;
  carrier?: string;

  date: string; // Creation date

  // Legacy fields for backward compatibility (optional or mapped)
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  paymentPlatform?: 'bKash' | 'Nagad';
  trxId?: string;
  status: OrderStatus; // Kept for legacy compatibility, synced with fulfillmentStatus
}

export interface User {
  username: string;
  role: 'admin' | 'user';
}
