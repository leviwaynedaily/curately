import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useProductOwnership } from "./useProductOwnership";
import { UploadProgress } from "./useProductMedia";

export const useMediaUpload = (productId: string, onSuccess: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ 
    current: 0, 
    total: 0, 
    percentage: 0 
  });
  const { toast } = useToast();
  const { verifyProductOwnership } = useProductOwnership();

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(true);
    setUploadProgress({ current: 0, total: files.length, percentage: 0 });
    console.log(`Starting media upload for ${files.length} files, product:`, productId);

    try {
      await verifyProductOwnership(productId);
      
      const fileArray = Array.from(files);
      let uploadedCount = 0;
      
      for (const file of fileArray) {
        console.log(`Processing file ${uploadedCount + 1} of ${fileArray.length}: ${file.name}`);
        
        const fileExt = file.name.split(".").pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;
        const mediaType = file.type.startsWith("video/") ? "video" : "image";

        console.log(`Uploading ${mediaType} to storage:`, file.name);
        const { error: uploadError } = await supabase.storage
          .from("gallery_images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Error uploading file:", file.name, uploadError);
          throw uploadError;
        }

        console.log("Creating media record for:", file.name);
        const { error: dbError } = await supabase
          .from("product_media")
          .insert([{
            product_id: productId,
            file_path: filePath,
            media_type: mediaType,
            is_primary: uploadedCount === 0 && fileArray.length === 1,
            title: file.name,
          }]);

        if (dbError) {
          console.error("Error creating media record:", dbError);
          throw dbError;
        }

        uploadedCount++;
        setUploadProgress(prev => ({
          current: uploadedCount,
          total: files.length,
          percentage: Math.round((uploadedCount / files.length) * 100)
        }));
        console.log(`Successfully uploaded ${uploadedCount} of ${fileArray.length} files`);
      }

      toast({ description: `Successfully uploaded ${fileArray.length} files` });
      onSuccess();
    } catch (error) {
      console.error("Media upload failed:", error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to upload media. Please try again.",
      });
    } finally {
      setIsLoading(false);
      setUploadProgress({ current: 0, total: 0, percentage: 0 });
    }
  };

  return {
    isLoading,
    uploadProgress,
    handleFileUpload,
  };
};