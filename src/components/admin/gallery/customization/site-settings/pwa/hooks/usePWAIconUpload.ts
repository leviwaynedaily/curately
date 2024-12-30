import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const usePWAIconUpload = (
  form: UseFormReturn<GalleryFormValues>,
  fieldName: keyof GalleryFormValues,
  size: string
) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting PWA icon ${size}x${size} upload...`, { file });

    try {
      if (!file.type.includes('png')) {
        throw new Error('Please upload a PNG file');
      }

      // Get storefront ID from form values instead of relying on the id field
      const storefrontId = form.getValues("id") || window.location.pathname.split('/').pop();
      
      if (!storefrontId) {
        console.error("No storefront ID available");
        throw new Error("Storefront ID is required");
      }

      console.log(`Uploading PWA icon for storefront:`, { storefrontId, size });

      const fileExt = file.name.split(".").pop();
      const filePath = getStorefrontFilePath(storefrontId, `pwa_icon_${size}`, fileExt || 'png');

      console.log(`Uploading ${size}x${size} icon to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(`Error uploading ${size}x${size} PWA icon:`, uploadError);
        throw uploadError;
      }

      console.log(`${size}x${size} icon uploaded successfully`);

      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      toast({ description: `${size}x${size} PWA icon uploaded successfully` });
    } catch (error) {
      console.error(`PWA icon ${size}x${size} upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to upload PWA icon",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearIcon = () => {
    console.log(`Clearing ${size}x${size} PWA icon`);
    form.setValue(fieldName, "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return {
    isUploading,
    handleIconUpload,
    clearIcon
  };
};