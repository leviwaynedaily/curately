export type Product = {
  id: string;
  storefront_id: string;
  name: string;
  description?: string;
  price?: number;
  sku?: string;
  category?: string;
  status?: string;
  stock_quantity?: number;
  created_at: string;
  updated_at: string;
  deletion_date?: string;
  primary_media?: string;
  tags?: { id: string; name: string; }[];
  product_media?: {
    id: string;
    file_path: string;
    media_type?: string;
    is_primary?: boolean;
    title?: string;
    description?: string;
  }[];
};