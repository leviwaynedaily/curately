import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryLogoField = ({ form }: GalleryLogoFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="logo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Logo URL</FormLabel>
          <FormControl>
            <Input placeholder="Enter logo URL" {...field} value={field.value || ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};