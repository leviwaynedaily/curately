import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type WizardNameStepProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const WizardNameStep = ({ form }: WizardNameStepProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter storefront name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};