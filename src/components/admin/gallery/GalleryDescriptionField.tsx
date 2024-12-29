import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Checkbox } from "@/components/ui/checkbox";

type GalleryDescriptionFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryDescriptionField = ({ form }: GalleryDescriptionFieldProps) => {
  console.log("GalleryDescriptionField render:", {
    formValues: form.getValues(),
    showDescription: form.getValues("show_description"),
  });

  return (
    <div className="space-y-4">
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

      <FormField
        control={form.control}
        name="show_description"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value ?? true}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Show description on storefront
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};