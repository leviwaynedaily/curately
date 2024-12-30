import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadField } from "../../shared/file-upload/FileUploadField";
import { ScreenshotPreview } from "./ScreenshotPreview";

type ScreenshotType = "desktop" | "mobile";

type ScreenshotUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  type: ScreenshotType;
  dimensions: string;
};

export const ScreenshotUploadField = ({ form, type, dimensions }: ScreenshotUploadFieldProps) => {
  const fieldName = `screenshot_${type}` as keyof GalleryFormValues;
  const label = `${type.charAt(0).toUpperCase() + type.slice(1)} Screenshot`;
  const currentValue = form.watch(fieldName);

  console.log(`ScreenshotUploadField render for ${type}:`, { 
    fieldName, 
    currentValue,
    formValues: form.getValues() 
  });

  return (
    <div className="space-y-4">
      <FileUploadField
        form={form}
        fieldName={fieldName}
        fileType={`screenshot_${type}`}
        label={label}
        description={`Screenshot dimensions ${dimensions}`}
      />
      
      {currentValue && typeof currentValue === 'string' && (
        <ScreenshotPreview 
          filePath={currentValue} 
          type={type} 
        />
      )}
    </div>
  );
};