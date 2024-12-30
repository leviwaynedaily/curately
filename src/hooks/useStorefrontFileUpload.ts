import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const useStorefrontFileUpload = (storefrontId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, fileType: string): Promise<string> => {
    setIsUploading(true);
    console.log("Starting file upload:", { storefrontId, fileType });

    try {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = getStorefrontFilePath(storefrontId, fileType, fileExt);

      console.log("Uploading file to path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("storefront_products")
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        toast({
          variant: "destructive",
          description: `Failed to upload ${fileType}. Please try again.`
        });
        throw uploadError;
      }

      console.log("File uploaded successfully to:", filePath);
      toast({
        description: `${fileType} uploaded successfully`
      });

      return filePath;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (filePath: string) => {
    try {
      console.log("Deleting file:", filePath);
      const { error } = await supabase.storage
        .from("storefront_products")
        .remove([filePath]);

      if (error) {
        console.error("Error deleting file:", error);
        toast({
          variant: "destructive",
          description: "Failed to delete file. Please try again."
        });
        throw error;
      }

      console.log("File deleted successfully");
      toast({
        description: "File deleted successfully"
      });
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