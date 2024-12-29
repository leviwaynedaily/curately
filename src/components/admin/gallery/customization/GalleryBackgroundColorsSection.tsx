import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryBackgroundColorsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryBackgroundColorsSection = ({ form }: GalleryBackgroundColorsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Background Colors</h3>
      <div className="text-sm text-muted-foreground mb-4">
        These colors define the overall look of your storefront.
      </div>
      
      <FormField
        control={form.control}
        name="primary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Background Color</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Main background color used throughout your storefront
            </div>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#141413'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#141413'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="secondary_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary Background Color</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Used for cards, panels, and other container elements
            </div>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#E6E4DD'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#E6E4DD'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accent_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accent Background Color</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Used for highlights, buttons, and interactive elements
            </div>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#9b87f5'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#9b87f5'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};