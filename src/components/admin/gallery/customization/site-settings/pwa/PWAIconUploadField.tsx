import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { PWAIconUploadButton } from "./PWAIconUploadButton";
import { PWAIconPreview } from "./PWAIconPreview";
import { usePWAIconUpload } from "./hooks/usePWAIconUpload";

type PWAIconUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  size: string;
};

export const PWAIconUploadField = ({ form, size }: PWAIconUploadFieldProps) => {
  const fieldName = size === "192" ? "pwa_icon_192" : "pwa_icon_512";
  const { isUploading, handleIconUpload, clearIcon } = usePWAIconUpload(form, fieldName as keyof GalleryFormValues, size);
  const iconPath = form.watch(fieldName);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{size}x{size} Icon</h4>
      </div>
      
      {iconPath ? (
        <PWAIconPreview 
          filePath={iconPath} 
          size={size} 
          onClear={clearIcon}
        />
      ) : (
        <PWAIconUploadButton
          isUploading={isUploading}
          uploadId={`pwa-icon-${size}`}
          onFileSelect={handleIconUpload}
          accept="image/png"
        />
      )}
    </div>
  );
};