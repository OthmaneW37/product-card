export type ProductCategory = 'shoes' | 'accessories' | 'apparel' | 'sports';

export interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  stock: number;
  discount?: number;
  isNew?: boolean;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FavoriteItem {
  productId: string;
  addedAt: number;
}
