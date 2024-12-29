import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadField } from "../../shared/FileUploadField";

type ScreenshotType = "desktop" | "mobile";

type ScreenshotUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  type: ScreenshotType;
  dimensions: string;
};

export const ScreenshotUploadField = ({ form, type, dimensions }: ScreenshotUploadFieldProps) => {
  const fieldName = `screenshot_${type}` as keyof GalleryFormValues;
  const label = `${type.charAt(0).toUpperCase() + type.slice(1)} Screenshot`;

  return (
    <FileUploadField
      form={form}
      fieldName={fieldName}
      fileType={`screenshot_${type}`}
      label={label}
      description={`Screenshot dimensions ${dimensions}`}
    />
  );
};