import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const useStorefrontFileUpload = (storefrontId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, fileType: string) => {
    try {
      const fileExt = file.name.split(".").pop() || "";
      const filePath = getStorefrontFilePath(storefrontId, fileType, fileExt);

      console.log(`Uploading ${fileType} to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("storefront_products")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      return filePath;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!filePath) return;
    
    try {
      const { error } = await supabase.storage
        .from("storefront_products")
        .remove([filePath]);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    setIsUploading
  };
};