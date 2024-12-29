import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadField } from "../../shared/file-upload/FileUploadField";

type FaviconFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const FaviconField = ({ form }: FaviconFieldProps) => {
  return (
    <FileUploadField
      form={form}
      fieldName="favicon"
      fileType="favicon"
      label="Favicon"
      description="The favicon appears in browser tabs and bookmarks. Upload a square image for best results."
      accept="image/x-icon,image/png"
    />
  );
};