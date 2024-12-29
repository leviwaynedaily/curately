import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { ScreenshotUploadField } from "./screenshots/ScreenshotUploadField";

type GalleryScreenshotsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryScreenshotsSection = ({ form }: GalleryScreenshotsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Screenshots</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Upload screenshots of your storefront for the PWA manifest.</p>
          <p>Desktop screenshot should be 1920×1080 pixels, and mobile screenshot should be 390×844 pixels.</p>
          <p>These screenshots will be displayed when users install your storefront as a PWA.</p>
        </div>
      </div>
      <div className="space-y-8">
        <ScreenshotUploadField 
          form={form} 
          type="desktop" 
          dimensions="(1920×1080)" 
        />
        <ScreenshotUploadField 
          form={form} 
          type="mobile" 
          dimensions="(390×844)" 
        />
      </div>
    </div>
  );
};