import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { GallerySiteLogoField } from "../GallerySiteLogoField";
import { useEffect } from "react";

type StorefrontBasicInfoProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const StorefrontBasicInfo = ({ form }: StorefrontBasicInfoProps) => {
  console.log("StorefrontBasicInfo render:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    siteLogo: form.watch("site_logo"),
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
      </div>
    </div>
  );
};