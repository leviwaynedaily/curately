import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getProductMediaPath } from "@/utils/storefrontFileUtils";

export const useProductFileUpload = (storefrontId: string, productId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      const filePath = getProductMediaPath(storefrontId, productId, file.name);
      const mediaType = file.type.startsWith("video/") ? "video" : "image";

      console.log(`Uploading ${mediaType} to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      return {
        filePath,
        mediaType,
        fileName: file.name
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      console.log("Deleting file:", filePath);
      const { error } = await supabase.storage
        .from("gallery_images")
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