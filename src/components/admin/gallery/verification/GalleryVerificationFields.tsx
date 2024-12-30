import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryPasswordSettings } from "./GalleryPasswordSettings";
import { GalleryVerificationText } from "./GalleryVerificationText";
import { VerificationLogoField } from "./VerificationLogoField";
import { Separator } from "@/components/ui/separator";

type GalleryVerificationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryVerificationFields = ({ form }: GalleryVerificationFieldsProps) => {
  const isVerificationEnabled = form.watch("verification_enabled");
  const isAgeVerificationEnabled = form.watch("age_verification_enabled");
  const isPasswordRequired = form.watch("password_required");

  return (
    <div className="space-y-6">
      {/* Step 1: Main Verification Toggle */}
      <FormField
        control={form.control}
        name="verification_enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Verification</FormLabel>
              <FormDescription>
                Show a verification prompt before allowing access to the gallery
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

      {isVerificationEnabled && (
        <div className="space-y-6 animate-in slide-in-from-top duration-300">
          <Separator />
          
          {/* Step 2: Verification Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verification Options</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="age_verification_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Age Verification</FormLabel>
                      <FormDescription>
                        Require age confirmation before access
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
          </div>

          <Separator />

          {/* Step 3: Verification Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verification Settings</h3>
            <VerificationLogoField form={form} />
            <GalleryVerificationText form={form} />
            
            {isPasswordRequired && (
              <>
                <h4 className="text-base font-medium mt-6">Password Settings</h4>
                <GalleryPasswordSettings form={form} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};