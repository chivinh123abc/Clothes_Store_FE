export interface ProductItem {
  product_item_id: number;
  sku: string;
  stock_quantity: number;
  product_item_image: string;
  product_item_price: number;
  discount_id?: number | null;
  sale_price?: number | null;
}

export type Product = {
  product_id: number;
  product_name: string;
  product_slug: string;
  category_id?: number;
  category_name?: string;
  product_description?: string;
  is_bestseller?: boolean;
  sold_count: number;
  created_at: string;
  updated_at?: string;
  soldOut?: boolean;
  collections?: string[];

  // Nested variants
  items?: ProductItem[];

  // Compatibility fields for filters if needed
  sizes?: string[];
  colors?: string[];
}
