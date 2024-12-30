import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryPasswordSettings } from "./verification/GalleryPasswordSettings";
import { GalleryVerificationText } from "./verification/GalleryVerificationText";
import { VerificationLogoField } from "./verification/VerificationLogoField";

type GalleryVerificationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryVerificationFields = ({ form }: GalleryVerificationFieldsProps) => {
  const isAgeVerificationEnabled = form.watch("age_verification_enabled");
  const isPasswordRequired = form.watch("password_required");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="age_verification_enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Age Verification</FormLabel>
                <FormDescription>
                  Enable age verification prompt before allowing access to the gallery
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
      </div>

      {(isAgeVerificationEnabled || isPasswordRequired) && (
        <div className="space-y-4 rounded-lg border p-4 animate-in slide-in-from-top duration-300">
          {isPasswordRequired && (
            <>
              <h3 className="text-lg font-medium">Password Settings</h3>
              <GalleryPasswordSettings form={form} />
            </>
          )}
          
          {isAgeVerificationEnabled && (
            <>
              <h3 className="text-lg font-medium">Age Verification Settings</h3>
              <VerificationLogoField form={form} />
              <GalleryVerificationText form={form} />
            </>
          )}
        </div>
      )}
    </div>
  );
};