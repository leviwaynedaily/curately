import * as z from "zod";

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").min(1, "Name is required"),
  password: z.string().optional(),
  status: z.string().optional().default("active"),
  business_id: z.string().min(1, "Business is required"),
  logo: z.string().optional(),
  description: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  accent_color: z.string().optional(),
  primary_font_color: z.string().optional(),
  secondary_font_color: z.string().optional(),
  accent_font_color: z.string().optional(),
  heading_text: z.string().optional(),
  subheading_text: z.string().optional(),
  age_verification_text: z.string().optional(),
  button_text: z.string().optional(),
  age_verification_enabled: z.boolean().optional().default(false),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;