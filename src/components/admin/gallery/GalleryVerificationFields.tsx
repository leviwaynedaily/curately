import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryLogoField } from "./GalleryLogoField";

type GalleryVerificationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryVerificationFields = ({ form }: GalleryVerificationFieldsProps) => {
  return (
    <div className="space-y-4">
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

      <GalleryLogoField form={form} />

      <FormField
        control={form.control}
        name="heading_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Verification Heading</FormLabel>
            <FormControl>
              <Input 
                placeholder="Age Verification Required" 
                {...field} 
                value={field.value || 'Age Verification Required'}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="subheading_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Verification Subheading</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="This website contains age-restricted content..." 
                {...field}
                value={field.value || 'This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.'}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="age_verification_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Confirmation Text</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="I confirm that I am 21 years of age or older..." 
                {...field}
                value={field.value || 'I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.'}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="button_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Button Text</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter Site" 
                {...field}
                value={field.value || 'Enter Site'}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};