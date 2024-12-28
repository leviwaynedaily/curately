import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProductOwnership } from "./useProductOwnership";

export type ProductMedia = {
  id: string;
  file_path: string;
  media_type: string;
  is_primary: boolean;
};

export type UploadProgress = {
  current: number;
  total: number;
  percentage: number;
};

export const useProductMedia = (productId: string, onMediaUpdate: () => void) => {
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ current: 0, total: 0, percentage: 0 });
  const { toast } = useToast();
  const { user } = useAuth();
  const { verifyProductOwnership } = useProductOwnership();

  const fetchMedia = async () => {
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    console.log("Fetching media for product:", productId);
    const { data, error } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching product media:", error);
      return;
    }

    console.log("Fetched product media:", data);
    setMedia(data);
  };

  const handleFileUpload = async (files: FileList) => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "You must be logged in to upload media",
      });
      return;
    }

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
            is_primary: media.length === 0 && fileArray.indexOf(file) === 0,
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
      fetchMedia();
      onMediaUpdate();
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

  const handleDelete = async (mediaId: string, filePath: string) => {
    if (!user) return;

    try {
      await verifyProductOwnership(productId);
      
      console.log("Deleting media:", mediaId);
      const { error: deleteError } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (deleteError) throw deleteError;

      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      toast({ description: "Media deleted successfully" });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete media",
      });
    }
  };

  const setPrimaryMedia = async (mediaId: string) => {
    if (!user) return;

    try {
      await verifyProductOwnership(productId);
      
      const { error: updateError } = await supabase
        .from("product_media")
        .update({ is_primary: false })
        .eq("product_id", productId);

      if (updateError) throw updateError;

      const { error: setPrimaryError } = await supabase
        .from("product_media")
        .update({ is_primary: true })
        .eq("id", mediaId);

      if (setPrimaryError) throw setPrimaryError;

      toast({ description: "Primary media updated" });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Error updating primary media:", error);
      toast({
        variant: "destructive",
        description: "Failed to update primary media",
      });
    }
  };

  return {
    media,
    isLoading,
    uploadProgress,
    fetchMedia,
    handleFileUpload,
    handleDelete,
    setPrimaryMedia,
  };
};