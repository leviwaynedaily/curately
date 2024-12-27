import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryNameFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryNameField = ({ form }: GalleryNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Gallery name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};