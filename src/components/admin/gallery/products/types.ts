export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sku: string | null;
  category: string | null;
  stock_quantity: number | null;
  status: string;
};