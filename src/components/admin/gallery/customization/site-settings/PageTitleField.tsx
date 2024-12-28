import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type PageTitleFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  siteName: string | undefined;
};

export const PageTitleField = ({ form, siteName }: PageTitleFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="page_title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Page Title</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter page title" 
              {...field} 
              value={field.value || siteName || ''} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};