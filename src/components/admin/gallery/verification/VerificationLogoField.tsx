import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { GalleryLogoField } from "../GalleryLogoField";

type VerificationLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const VerificationLogoField = ({ form }: VerificationLogoFieldProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Verification Logo</h4>
      <div className="text-sm text-muted-foreground mb-2">
        This logo appears on the verification screen when visitors first enter your storefront.
        Choose a logo that represents your brand and creates a professional first impression.
      </div>
      <GalleryLogoField form={form} />
    </div>
  );
};