import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GallerySiteLogoField } from "../GallerySiteLogoField";
import { useEffect } from "react";

type StorefrontBasicInfoProps = {
  form: UseFormReturn<GalleryFormValues>;
};

type HeaderDisplayType = "text" | "logo";

export const StorefrontBasicInfo = ({ form }: StorefrontBasicInfoProps) => {
  console.log("StorefrontBasicInfo render:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    headerDisplay: form.watch("header_display"),
    showDescription: form.watch("show_description"),
    siteLogo: form.watch("site_logo"),
    formValues: form.getValues(),
    defaultValues: form.formState.defaultValues
  });

  // Monitor header_display changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name === "header_display") {
        console.log("header_display changed:", {
          newValue: value.header_display,
          type,
          formValues: form.getValues()
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <GalleryNameField form={form} />
        
        <FormField
          control={form.control}
          name="header_display"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormControl>
                <RadioGroup
                  onValueChange={(value: HeaderDisplayType) => {
                    console.log("Radio group value changed to:", value);
                    field.onChange(value);
                    // Ensure the form knows it's dirty
                    form.setValue("header_display", value, {
                      shouldDirty: true,
                      shouldTouch: true
                    });
                  }}
                  value={(field.value as HeaderDisplayType) || "text"}
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
          <div className="mt-2">
            <GallerySiteLogoField form={form} />
          </div>
        )}

        <div className="pt-4">
          <GalleryDescriptionField form={form} />
        </div>
      </div>
    </div>
  );
};