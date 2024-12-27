import * as z from "zod";

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").min(1, "Name is required"),
  password: z.string().optional(),
  status: z.string().optional().default("active"),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;