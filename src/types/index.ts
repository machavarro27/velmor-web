export type FlavorType = 'fresa' | 'mora' | 'mango' | 'maracuya' | 'natural';
export type SizeType = '200g' | '500g';

export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  flavor: FlavorType;
  size: SizeType;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionEn?: string;
  image: string;
  badge?: string;
  badgeEn?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    calcium: number;
  };
  stock: number;
  rating: number;
  reviews: number;
  featured?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  commentEn?: string;
  date: string;
  verified: boolean;
  product: string;
}

export type ThemeType = 'nordic' | 'warm' | 'dark';
export type LanguageType = 'es' | 'en';
export type Theme = ThemeType;
export type Language = LanguageType;

export interface FilterState {
  search: string;
  size: 'all' | SizeType;
  flavor: 'all' | FlavorType;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'google' | 'microsoft' | 'email';
  phone?: string;
  address?: string;
  isSubscribed?: boolean;
  favorites: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface Stats {
  visits: number;
  sales: number;
  customers: number;
  rating: number;
}

export interface ShippingInfo {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  neighborhood?: string;
  city: string;
  postalCode?: string;
  notes?: string;
}
