import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { PWAIconsSection } from "../customization/site-settings/PWAIconsSection";
import { GalleryScreenshotsSection } from "../customization/GalleryScreenshotsSection";

type GalleryPWAFieldsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryPWAFields = ({ form }: GalleryPWAFieldsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-2">Progressive Web App (PWA) Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize how your storefront appears when installed as a Progressive Web App on mobile devices and desktops.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <PWAIconsSection form={form} />
        </div>
        <div className="space-y-8">
          <GalleryScreenshotsSection form={form} />
        </div>
      </div>
    </div>
  );
};