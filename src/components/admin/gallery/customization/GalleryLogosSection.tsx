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
      <div className="text-sm text-muted-foreground mb-4">
        Upload and manage your storefront logos for different purposes.
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Age Verification Logo</h4>
          <div className="text-sm text-muted-foreground mb-2">
            This logo appears on the age verification screen when visitors first enter your storefront.
            Choose a logo that represents your brand and creates a professional first impression.
          </div>
          <GalleryLogoField form={form} />
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Storefront Logo</h4>
          <div className="text-sm text-muted-foreground mb-2">
            This logo is displayed in your main storefront header and throughout the shopping experience.
            It can be different from your age verification logo if desired.
          </div>
          <GallerySiteLogoField form={form} />
        </div>
      </div>
    </div>
  );
};