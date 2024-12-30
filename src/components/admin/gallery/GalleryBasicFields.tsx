import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryDescriptionField } from "./GalleryDescriptionField";
import { GallerySiteLogoField } from "./GallerySiteLogoField";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type GalleryBasicFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryBasicFields = ({ form }: GalleryBasicFieldsProps) => {
  console.log("GalleryBasicFields render:", {
    headerDisplay: form.watch("header_display"),
    showDescription: form.watch("show_description"),
    siteLogo: form.watch("site_logo"),
    formValues: form.getValues()
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GalleryNameField form={form} />
        <GalleryBusinessField form={form} />
        <GalleryDescriptionField form={form} />
        
        <FormField
          control={form.control}
          name="show_description"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Show description on storefront</Label>
                <div className="text-sm text-muted-foreground">
                  Display your storefront description below the header
                </div>
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

      <div className="space-y-4 border-t pt-6">
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
                  value={field.value || "text"}
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

      {form.watch("header_display") === "logo" && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Storefront Logo</h4>
          <div className="text-sm text-muted-foreground mb-2">
            This logo will be displayed in your main storefront header instead of the text name
          </div>
          <GallerySiteLogoField form={form} />
        </div>
      )}
    </div>
  );
};