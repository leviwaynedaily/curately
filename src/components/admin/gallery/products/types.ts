export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sku: string | null;
  category: string | null;
  stock_quantity: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  primary_media?: string | null;
  product_media?: Array<{
    id: string;
    file_path: string;
    is_primary: boolean;
  }>;
};