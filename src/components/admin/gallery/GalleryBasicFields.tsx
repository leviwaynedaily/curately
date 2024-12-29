import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryDescriptionField } from "./GalleryDescriptionField";
import { GallerySiteLogoField } from "./GallerySiteLogoField";
import { FaviconField } from "./customization/site-settings/FaviconField";

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
        <h4 className="text-sm font-medium">Storefront Logo</h4>
        <div className="text-sm text-muted-foreground mb-2">
          This logo is displayed in your main storefront header and throughout the shopping experience.
        </div>
        <GallerySiteLogoField form={form} />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Favicon</h4>
        <div className="text-sm text-muted-foreground mb-2">
          The favicon appears in browser tabs and bookmarks. Upload a square image for best results.
        </div>
        <FaviconField form={form} />
      </div>
    </div>
  );
};