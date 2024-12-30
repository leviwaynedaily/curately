import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

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
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const uploadId = `${fieldName}-upload`;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting ${fileType} upload...`);

    try {
      const fileExt = file.name.split(".").pop();
      const storefrontId = form.getValues("id");
      if (!storefrontId) {
        throw new Error("Storefront ID is required");
      }

      const filePath = getStorefrontFilePath(storefrontId, fileType, fileExt || 'png');
      console.log(`Uploading ${fileType} to path:`, filePath);

      const { error: uploadError, data } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error(`Error uploading ${fileType}:`, uploadError);
        throw uploadError;
      }

      console.log(`${fileType} uploaded successfully, file path:`, filePath);
      form.setValue(fieldName, filePath, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
      
      toast({ description: `${label} uploaded successfully` });
    } catch (error) {
      console.error(`${fileType} upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : `Failed to upload ${label}`,
      });
    } finally {
      setIsUploading(false);
      // Reset the input value to allow uploading the same file again
      const input = document.getElementById(uploadId) as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  const clearFile = () => {
    form.setValue(fieldName, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  const currentValue = form.watch(fieldName);

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
          <div className="space-y-4">
            {currentValue && typeof currentValue === 'string' && currentValue !== "" ? (
              <div className="relative w-40 h-40">
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(currentValue).data.publicUrl}
                  alt={label}
                  className="w-full h-full object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearFile}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <FormControl>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => document.getElementById(uploadId)?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : `Upload ${label}`}
                  </Button>
                  <Input
                    id={uploadId}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </FormControl>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};