export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  bestseller: boolean;
  createdAt: string;
  soldOut: boolean;
  description?: string;
}
