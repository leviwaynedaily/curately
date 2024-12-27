import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryPasswordSettingsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryPasswordSettings = ({ form }: GalleryPasswordSettingsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Password Protection</FormLabel>
              <FormDescription>
                Require a password to access the gallery
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch("password_required") && (
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
      )}
    </div>
  );
};