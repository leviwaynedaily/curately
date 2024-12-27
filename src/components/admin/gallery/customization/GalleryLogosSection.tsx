import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryLogoField } from "../GalleryLogoField";
import { GallerySiteLogoField } from "../GallerySiteLogoField";

type GalleryLogosSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryLogosSection = ({ form }: GalleryLogosSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Logos</h3>
      <GalleryLogoField form={form} />
      <GallerySiteLogoField form={form} />
    </div>
  );
};