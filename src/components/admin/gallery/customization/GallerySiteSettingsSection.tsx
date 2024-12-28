import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Separator } from "@/components/ui/separator";
import { PageTitleField } from "./site-settings/PageTitleField";
import { FaviconField } from "./site-settings/FaviconField";
import { PWAIconsSection } from "./site-settings/PWAIconsSection";

type GallerySiteSettingsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GallerySiteSettingsSection = ({ form }: GallerySiteSettingsSectionProps) => {
  const siteName = form.watch("name");

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Site Settings</h3>
      <PageTitleField form={form} siteName={siteName} />
      <FaviconField form={form} />
      <Separator className="my-6" />
      <PWAIconsSection form={form} />
    </div>
  );
};