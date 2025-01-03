export type Storefront = {
  id: string;
  business_id?: string;
  name: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  logo?: string;
  description?: string;
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  heading_text?: string;
  subheading_text?: string;
  age_verification_message?: string;
  button_text?: string;
  age_verification_enabled?: boolean;
  primary_font_color?: string;
  secondary_font_color?: string;
  accent_font_color?: string;
  password_required?: boolean;
  site_logo?: string;
  age_verification_text?: string;
  page_title?: string;
  favicon?: string;
  instructions_enabled?: boolean;
  instructions_content?: string;
  instructions_button_text?: string;
  pwa_icon_192?: string;
  pwa_icon_512?: string;
  show_description?: boolean;
  screenshot_desktop?: string;
  screenshot_mobile?: string;
  header_display?: string;  // Changed from "text" | "logo" to string to match database
  verification_enabled?: boolean;
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
  created_at?: string;
  updated_at?: string;
  product_id?: string | null;
};