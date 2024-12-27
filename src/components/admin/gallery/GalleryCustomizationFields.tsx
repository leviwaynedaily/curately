import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type GalleryCustomizationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryCustomizationFields = ({ form }: GalleryCustomizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="primary_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="color" {...field} value={field.value || '#FF719A'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FF719A'} className="flex-1" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondary_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="color" {...field} value={field.value || '#FFA99F'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FFA99F'} className="flex-1" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accent_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accent Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Input type="color" {...field} value={field.value || '#FFE29F'} className="w-16 h-10" />
                  <Input {...field} value={field.value || '#FFE29F'} className="flex-1" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="heading_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age Verification Heading</FormLabel>
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
            <FormLabel>Age Verification Subheading</FormLabel>
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