import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type GalleryBusinessFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryBusinessField = ({ form }: GalleryBusinessFieldProps) => {
  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      console.log("Fetching businesses for gallery form...");
      const { data, error } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      console.log("Fetched businesses:", data);
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="business_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Business</FormLabel>
          <Select
            disabled={isLoading}
            onValueChange={field.onChange}
            value={field.value || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a business" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {businesses?.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};