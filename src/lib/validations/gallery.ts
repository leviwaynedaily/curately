import * as z from "zod";

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").min(1, "Name is required"),
  password: z.string().optional(),
  status: z.string().optional().default("active"),
  business_id: z.string().min(1, "Business is required"),
  logo: z.string().optional(),
  description: z.string().optional(),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;