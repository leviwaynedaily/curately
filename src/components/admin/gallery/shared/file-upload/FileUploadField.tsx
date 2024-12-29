import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadButton } from "./FileUploadButton";
import { FileUploadPreview } from "./FileUploadPreview";
import { useFileUpload } from "./useFileUpload";

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
  accept
}: FileUploadFieldProps) => {
  const { isUploading, handleFileUpload, clearFile } = useFileUpload(form, fieldName, fileType);
  const uploadId = `${fieldName}-upload`;
  const fieldValue = form.watch(fieldName);

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
                  onClear={clearFile}
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