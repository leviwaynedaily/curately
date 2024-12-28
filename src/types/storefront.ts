export type Storefront = {
  id: string;
  name: string;
  password?: string | null;
  status?: string;
  created_at?: string;
  logo?: string | null;
  site_logo?: string | null;
  description?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  accent_color?: string | null;
  primary_font_color?: string | null;
  secondary_font_color?: string | null;
  accent_font_color?: string | null;
  heading_text?: string | null;
  subheading_text?: string | null;
  age_verification_message?: string | null;
  age_verification_text?: string | null;
  button_text?: string | null;
  age_verification_enabled?: boolean;
  password_required?: boolean;
  page_title?: string | null;
  favicon?: string | null;
  businesses?: {
    name: string;
  };
};

export type StorefrontImage = {
  id: string;
  file_path: string;
  title?: string | null;
  description?: string | null;
  media_type?: string | null;
  price?: number | null;
  is_featured?: boolean | null;
};