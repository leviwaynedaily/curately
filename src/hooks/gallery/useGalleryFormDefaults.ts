import { GalleryFormValues } from "@/lib/validations/gallery";

export const getDefaultValues = (
  gallery?: {
    id?: string;
    name: string;
    status?: string;
    password?: string;
    business_id?: string;
    logo?: string;
    site_logo?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    primary_font_color?: string;
    secondary_font_color?: string;
    accent_font_color?: string;
    heading_text?: string;
    subheading_text?: string;
    age_verification_text?: string;
    button_text?: string;
    age_verification_enabled?: boolean;
    password_required?: boolean;
    page_title?: string;
    favicon?: string;
    instructions_enabled?: boolean;
    instructions_content?: string;
    instructions_button_text?: string;
    show_description?: boolean;
  },
  businessId?: string
): GalleryFormValues => ({
  name: gallery?.name || "",
  password: gallery?.password || "",
  status: gallery?.status || "active",
  business_id: gallery?.business_id || businessId || "",
  logo: gallery?.logo || "",
  site_logo: gallery?.site_logo || gallery?.logo || "",
  description: gallery?.description || "",
  primary_color: gallery?.primary_color || "#141413",
  secondary_color: gallery?.secondary_color || "#E6E4DD",
  accent_color: gallery?.accent_color || "#9b87f5",
  primary_font_color: gallery?.primary_font_color || "#000000",
  secondary_font_color: gallery?.secondary_font_color || "#6E59A5",
  accent_font_color: gallery?.accent_font_color || "#8B5CF6",
  heading_text: gallery?.heading_text || "Age Verification Required",
  subheading_text: gallery?.subheading_text || "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
  age_verification_text: gallery?.age_verification_text || "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
  button_text: gallery?.button_text || "Enter Site",
  age_verification_enabled: gallery?.age_verification_enabled || false,
  password_required: gallery?.password_required || false,
  currentTab: "basic",
  page_title: gallery?.page_title || gallery?.name || "",
  favicon: gallery?.favicon || "",
  instructions_enabled: gallery?.instructions_enabled || false,
  instructions_content: gallery?.instructions_content || "",
  instructions_button_text: gallery?.instructions_button_text || "Enter Site",
  show_description: typeof gallery?.show_description === 'boolean' ? gallery.show_description : true,
});