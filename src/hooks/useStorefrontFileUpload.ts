import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

export const useStorefrontFileUpload = (storefrontId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, fileType: string): Promise<string> => {
    if (!storefrontId) {
      throw new Error("Storefront ID is required");
    }

    setIsUploading(true);
    console.log("Starting file upload:", { storefrontId, fileType, fileName: file.name });

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
        toast({
          variant: "destructive",
          description: "Failed to upload file. Please try again."
        });
        throw uploadError;
      }

      // Update the storefront record with the new file path
      const updateData = { [fileType]: filePath };
      const { error: updateError } = await supabase
        .from("storefronts")
        .update(updateData)
        .eq("id", storefrontId);

      if (updateError) {
        console.error("Error updating storefront with file path:", updateError);
        toast({
          variant: "destructive",
          description: "Failed to save file reference. Please try again."
        });
        throw updateError;
      }

      console.log("File uploaded and storefront updated successfully:", { filePath });
      toast({
        description: `${fileType} uploaded successfully`
      });

      return filePath;
    } catch (error) {
      console.error("File upload failed:", error);
      throw error;
    } finally {
      setIsUploading(false);  // Fixed: Changed setIsLoading to setIsUploading
    }
  };

  const deleteFile = async (filePath: string) => {
    if (!filePath) return;

    try {
      console.log("Deleting file:", filePath);
      const { error: deleteError } = await supabase.storage
        .from("gallery_images")
        .remove([filePath]);

      if (deleteError) {
        console.error("Error deleting file:", deleteError);
        toast({
          variant: "destructive",
          description: "Failed to delete file. Please try again."
        });
        throw deleteError;
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