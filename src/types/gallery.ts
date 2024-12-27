export type Gallery = {
  id: string;
  name: string;
  password?: string | null;
  status?: string;
  created_at?: string;
  businesses?: {
    name: string;
  };
  gallery_images?: GalleryImage[];
};

export type GalleryImage = {
  id: string;
  file_path: string;
  title?: string | null;
  description?: string | null;
  media_type?: 'image' | 'video';
  price?: number | null;
  is_featured?: boolean;
};