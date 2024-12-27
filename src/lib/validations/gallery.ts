import * as z from "zod";

export const gallerySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().optional(),
});

export type GalleryFormValues = z.infer<typeof gallerySchema>;