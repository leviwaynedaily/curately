import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryBackgroundColorsSection } from "./customization/GalleryBackgroundColorsSection";
import { GalleryFontColorsSection } from "./customization/GalleryFontColorsSection";

type GalleryCustomizationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryCustomizationFields = ({ form }: GalleryCustomizationFieldsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <GalleryBackgroundColorsSection form={form} />
        </div>
        <div className="space-y-8">
          <GalleryFontColorsSection form={form} />
        </div>
      </div>
    </div>
  );
};