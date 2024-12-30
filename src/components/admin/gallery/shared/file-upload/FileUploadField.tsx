import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FileUploadButton } from "./FileUploadButton";
import { FileUploadPreview } from "./FileUploadPreview";
import { useStorefrontFileUpload } from "@/hooks/useStorefrontFileUpload";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  // Get storefrontId from form values, but don't require it
  const storefrontId = form.getValues("id");
  const { isUploading, uploadFile, deleteFile } = useStorefrontFileUpload(storefrontId);
  const uploadId = `${fieldName}-upload`;
  const fieldValue = form.watch(fieldName);

  console.log("FileUploadField render:", {
    fieldName,
    fileType,
    storefrontId,
    currentValue: fieldValue,
    isUploading,
    formValues: form.getValues()
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // For new storefronts, store the file temporarily
    if (!storefrontId) {
      console.log("New storefront - storing file temporarily");
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result as string;
        form.setValue(fieldName, base64Data, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
        toast({
          description: "File selected and will be uploaded when the storefront is created"
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    console.log("Starting file upload:", { 
      fileName: file.name, 
      fileType, 
      storefrontId,
      formValues: form.getValues() 
    });

    try {
      const filePath = await uploadFile(file, fileType);
      console.log("File uploaded successfully, setting form value:", { filePath });
      
      form.setValue(fieldName, filePath, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      // Reset the input value to allow uploading the same file again
      const input = document.getElementById(uploadId) as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const handleClearFile = async () => {
    if (typeof fieldValue === 'string' && fieldValue) {
      // If it's a base64 string (temporary file), just clear it
      if (fieldValue.startsWith('data:')) {
        form.setValue(fieldName, "", {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });
        return;
      }

      // Otherwise delete from storage
      console.log("Deleting file:", { fieldName, filePath: fieldValue });
      await deleteFile(fieldValue);
      form.setValue(fieldName, "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
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
