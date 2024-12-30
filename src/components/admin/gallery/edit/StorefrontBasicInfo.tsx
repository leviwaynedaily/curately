import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GallerySiteLogoField } from "../GallerySiteLogoField";

type StorefrontBasicInfoProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const StorefrontBasicInfo = ({ form }: StorefrontBasicInfoProps) => {
  console.log("StorefrontBasicInfo render:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    headerDisplay: form.watch("header_display"),
    showDescription: form.watch("show_description")
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GalleryNameField form={form} />
        <GalleryDescriptionField form={form} />
        
        <FormField
          control={form.control}
          name="show_description"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Show description</Label>
                <div className="text-sm text-muted-foreground">
                  Display description below the header
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
        <FormField
          control={form.control}
          name="header_display"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <Label className="text-base">Header Display</Label>
                <div className="text-sm text-muted-foreground">
                  Choose how to display your storefront header
                </div>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || "text"}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="header-text" />
                    <Label htmlFor="header-text">Display name as text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="logo" id="header-logo" />
                    <Label htmlFor="header-logo">Use logo</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("header_display") === "logo" && (
          <div className="mt-4">
            <GallerySiteLogoField form={form} />
          </div>
        )}
      </div>
    </div>
  );
};