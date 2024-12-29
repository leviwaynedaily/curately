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
      <div className="text-sm text-muted-foreground mb-4">
        These colors control the text appearance throughout your storefront.
      </div>

      <FormField
        control={form.control}
        name="primary_font_color"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Font Color</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Main text color used for headings and body text
            </div>
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
            <div className="text-sm text-muted-foreground mb-2">
              Used for subtitles, descriptions, and less prominent text
            </div>
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
            <FormLabel>Price & Highlight Font Color</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Used for prices, links, and important highlighted text
            </div>
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