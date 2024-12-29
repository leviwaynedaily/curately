import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadField } from "./shared/FileUploadField";

type GalleryLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryLogoField = ({ form }: GalleryLogoFieldProps) => {
  return (
    <FileUploadField
      form={form}
      fieldName="logo"
      fileType="logo"
      label="Logo"
      description="This logo appears on the verification screen when visitors first enter your storefront."
    />
  );
};