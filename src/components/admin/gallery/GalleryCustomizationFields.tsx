import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryCustomizationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryCustomizationFields = ({ form }: GalleryCustomizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="primary_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="color" {...field} value={field.value || '#FF719A'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FF719A'} className="flex-1" />
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
              <FormLabel>Secondary Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="color" {...field} value={field.value || '#FFA99F'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FFA99F'} className="flex-1" />
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
                  <Input type="color" {...field} value={field.value || '#FFE29F'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FFE29F'} className="flex-1" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};