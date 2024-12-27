import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryPasswordFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryPasswordField = ({ form }: GalleryPasswordFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password (Optional)</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="Password"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};