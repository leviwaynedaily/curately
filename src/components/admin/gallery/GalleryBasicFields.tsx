import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryDescriptionField } from "./GalleryDescriptionField";
import { GallerySiteLogoField } from "./GallerySiteLogoField";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type GalleryBasicFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryBasicFields = ({ form }: GalleryBasicFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GalleryNameField form={form} />
        <GalleryBusinessField form={form} />
        <GalleryDescriptionField form={form} />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Header Display</h4>
        <div className="text-sm text-muted-foreground mb-2">
          Choose how you want your storefront header to be displayed
        </div>
        <FormField
          control={form.control}
          name="header_display"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value || "text"}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="header-text" />
                    <Label htmlFor="header-text">Display storefront name as text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="logo" id="header-logo" />
                    <Label htmlFor="header-logo">Use logo instead of text</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Storefront Logo</h4>
        <div className="text-sm text-muted-foreground mb-2">
          This logo is displayed in your main storefront header when logo display is selected
        </div>
        <GallerySiteLogoField form={form} />
      </div>
    </div>
  );
};