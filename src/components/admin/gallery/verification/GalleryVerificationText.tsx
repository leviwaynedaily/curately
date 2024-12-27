import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryVerificationTextProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryVerificationText = ({ form }: GalleryVerificationTextProps) => {
  return (
    <div className="space-y-4">
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