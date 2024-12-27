import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryFontColorsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryFontColorsSection = ({ form }: GalleryFontColorsSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Font Colors</h3>
      <FormField
        control={form.control}
        name="primary_font_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Font Color</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#000000'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#000000'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="secondary_font_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Secondary Font Color</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#6E59A5'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#6E59A5'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accent_font_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accent Font Color</FormLabel>
            <FormControl>
              <div className="flex gap-2">
                <Input type="color" {...field} value={field.value || '#8B5CF6'} className="w-16 h-10" />
                <Input {...field} value={field.value || '#8B5CF6'} className="flex-1" />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};