import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BusinessFormValues } from "@/lib/validations/business";

type BusinessNameFieldProps = {
  form: UseFormReturn<BusinessFormValues>;
};

export const BusinessNameField = ({ form }: BusinessNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Business name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};