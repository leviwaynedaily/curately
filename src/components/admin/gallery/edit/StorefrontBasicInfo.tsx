import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { GallerySiteLogoField } from "../GallerySiteLogoField";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

type StorefrontBasicInfoProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const StorefrontBasicInfo = ({ form }: StorefrontBasicInfoProps) => {
  console.log("StorefrontBasicInfo render:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    siteLogo: form.watch("site_logo"),
    showDescription: form.watch("show_description"),
    formValues: form.getValues(),
    defaultValues: form.formState.defaultValues
  });

  // Always set header_display to "logo"
  useEffect(() => {
    form.setValue("header_display", "logo", { shouldDirty: false });
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GalleryNameField form={form} />
        
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Storefront Logo</h4>
          <div className="text-sm text-muted-foreground mb-2">
            This logo will be displayed in your main storefront header
          </div>
          <GallerySiteLogoField form={form} />
        </div>

        <div className="pt-4">
          <GalleryDescriptionField form={form} />
        </div>

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
    </div>
  );
};