export type Gallery = {
  id: string;
  name: string;
  password?: string | null;
  status?: string;
  created_at?: string;
  logo?: string | null;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  heading_text?: string | null;
  subheading_text?: string | null;
  age_verification_text?: string | null;
  button_text?: string | null;
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
  media_type?: string | null;
  price?: number | null;
  is_featured?: boolean | null;
};