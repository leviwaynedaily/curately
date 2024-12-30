import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryPasswordSettings } from "./GalleryPasswordSettings";
import { GalleryVerificationText } from "./GalleryVerificationText";
import { VerificationLogoField } from "./VerificationLogoField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GalleryVerificationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryVerificationFields = ({ form }: GalleryVerificationFieldsProps) => {
  const isVerificationEnabled = form.watch("verification_enabled");
  const isAgeVerificationEnabled = form.watch("age_verification_enabled");
  const isPasswordRequired = form.watch("password_required");

  console.log("Verification fields state:", {
    isVerificationEnabled,
    isAgeVerificationEnabled,
    isPasswordRequired
  });

  return (
    <div className="space-y-6">
      {/* Step 1: Main Verification Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Step 1: Enable Verification</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {isVerificationEnabled && (
        <>
          {/* Step 2: Verification Options */}
          <Card className="animate-in slide-in-from-top duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Step 2: Choose Verification Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Step 3: Verification Settings */}
          {(isAgeVerificationEnabled || isPasswordRequired) && (
            <Card className="animate-in slide-in-from-top duration-300">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Step 3: Configure Verification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {isAgeVerificationEnabled && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Age Verification Settings</h4>
                    <VerificationLogoField form={form} />
                    <GalleryVerificationText form={form} />
                  </div>
                )}
                
                {isPasswordRequired && (
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Password Settings</h4>
                    <GalleryPasswordSettings form={form} />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};