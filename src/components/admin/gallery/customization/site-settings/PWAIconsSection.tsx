import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { PWAIconsDescription } from "./pwa/PWAIconsDescription";
import { PWAIconUploadField } from "./pwa/PWAIconUploadField";

type PWAIconsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const PWAIconsSection = ({ form }: PWAIconsSectionProps) => {
  return (
    <div>
      <PWAIconsDescription />
      <div className="space-y-6">
        <PWAIconUploadField form={form} size="192" />
        <PWAIconUploadField form={form} size="512" />
      </div>
    </div>
  );
};