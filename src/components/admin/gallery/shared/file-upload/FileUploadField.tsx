import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadButton } from "./FileUploadButton";
import { FileUploadPreview } from "./FileUploadPreview";
import { useStorefrontFileUpload } from "@/hooks/useStorefrontFileUpload";

type FileUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  fieldName: keyof GalleryFormValues;
  fileType: string;
  label: string;
  description?: string;
  accept?: string;
};

export const FileUploadField = ({
  form,
  fieldName,
  fileType,
  label,
  description,
  accept = "image/*"
}: FileUploadFieldProps) => {
  const storefrontId = form.getValues("id");
  const { isUploading, uploadFile, deleteFile } = useStorefrontFileUpload(storefrontId);
  const uploadId = `${fieldName}-upload`;
  const fieldValue = form.watch(fieldName);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storefrontId) return;

    try {
      const filePath = await uploadFile(file, fileType);
      
      form.setValue(fieldName, filePath, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    } catch (error) {
      console.error(`${fileType} upload failed:`, error);
    }
  };

  const handleClearFile = async () => {
    if (typeof fieldValue === 'string') {
      await deleteFile(fieldValue);
    }
    
    form.setValue(fieldName, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && (
            <div className="text-sm text-muted-foreground mb-2">
              {description}
            </div>
          )}
          <FormControl>
            <div className="space-y-4">
              {typeof fieldValue === 'string' && fieldValue ? (
                <FileUploadPreview
                  filePath={fieldValue}
                  onClear={handleClearFile}
                  label={label}
                />
              ) : (
                <FileUploadButton
                  isUploading={isUploading}
                  onFileSelect={handleFileUpload}
                  uploadId={uploadId}
                  accept={accept}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};