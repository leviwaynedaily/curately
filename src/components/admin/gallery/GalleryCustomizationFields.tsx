import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryLogosSection } from "./customization/GalleryLogosSection";
import { GalleryBackgroundColorsSection } from "./customization/GalleryBackgroundColorsSection";
import { GalleryFontColorsSection } from "./customization/GalleryFontColorsSection";

type GalleryCustomizationFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryCustomizationFields = ({ form }: GalleryCustomizationFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GalleryLogosSection form={form} />
        <GalleryBackgroundColorsSection form={form} />
        <GalleryFontColorsSection form={form} />
      </div>
    </div>
  );
};