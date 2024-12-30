import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryDescriptionFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryDescriptionField = ({ form }: GalleryDescriptionFieldProps) => {
  console.log("GalleryDescriptionField render:", {
    formValues: form.getValues(),
    showDescription: form.getValues("show_description"),
  });

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Enter gallery description" 
              className="min-h-[120px]" 
              {...field} 
              value={field.value || ''} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};