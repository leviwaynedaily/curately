import * as z from "zod";

export const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").min(1, "Name is required"),
  status: z.string().optional().default("active"),
});

export type BusinessFormValues = z.infer<typeof businessSchema>;