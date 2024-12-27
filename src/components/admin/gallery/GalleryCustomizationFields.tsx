import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryLogoField } from "./GalleryLogoField";
import { GallerySiteLogoField } from "./GallerySiteLogoField";

type GalleryCustomizationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryCustomizationFields = ({ form }: GalleryCustomizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="font-medium">Logos</h3>
          <GalleryLogoField form={form} />
          <GallerySiteLogoField form={form} />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Background Colors</h3>
          <FormField
            control={form.control}
            name="primary_color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Background Color</FormLabel>
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
                <FormLabel>Accent Color</FormLabel>
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
      </div>
    </div>
  );
};