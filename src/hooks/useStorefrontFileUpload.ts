import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const useStorefrontFileUpload = (storefrontId: string | undefined) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, fileType: string): Promise<string> => {
    if (!storefrontId) {
      console.error("No storefront ID provided for file upload");
      throw new Error("Storefront ID is required");
    }

    setIsUploading(true);
    console.log("Starting file upload in hook:", { storefrontId, fileType, fileName: file.name });

    try {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = getStorefrontFilePath(storefrontId, fileType, fileExt);
      console.log("Generated file path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully:", { filePath });
      return filePath;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!filePath) return;

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
    isUploading,
    uploadFile,
    deleteFile
  };
};
