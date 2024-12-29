import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const useFileUpload = (
  form: UseFormReturn<GalleryFormValues>,
  fieldName: keyof GalleryFormValues,
  fileType: string
) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const storefrontId = form.getValues("id");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storefrontId) return;

    setIsUploading(true);
    console.log(`Starting ${fileType} upload...`);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = getStorefrontFilePath(storefrontId, fileType, fileExt || "png");

      console.log(`Uploading ${fileType} to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, { upsert: true });

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
      
      toast({ description: `File uploaded successfully` });
    } catch (error) {
      console.error(`${fileType} upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : `Failed to upload file`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    form.setValue(fieldName, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    isUploading,
    handleFileUpload,
    clearFile
  };
};