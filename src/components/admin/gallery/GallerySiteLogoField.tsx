import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadField } from "./shared/file-upload/FileUploadField";

type GallerySiteLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GallerySiteLogoField = ({ form }: GallerySiteLogoFieldProps) => {
  return (
    <FileUploadField
      form={form}
      fieldName="site_logo"
      fileType="site_logo"
      label="Site Logo"
      description="This logo is displayed in your main storefront header and throughout the shopping experience."
    />
  );
};