import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryPasswordSettingsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryPasswordSettings = ({ form }: GalleryPasswordSettingsProps) => {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Gallery Password</FormLabel>
          <FormControl>
            <Input
              type="password"
              placeholder="Enter gallery password"
              {...field}
              value={field.value || ""}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};