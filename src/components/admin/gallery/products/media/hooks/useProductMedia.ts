import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProductOwnership } from "./useProductOwnership";
import {
  uploadMediaFile,
  createMediaRecord,
  deleteMediaRecord,
  deleteMediaFile,
  updatePrimaryStatus,
} from "../utils/mediaOperations";

export type ProductMedia = {
  id: string;
  file_path: string;
  media_type: string;
  is_primary: boolean;
};

export const useProductMedia = (productId: string, onMediaUpdate: () => void) => {
  const [media, setMedia] = useState<ProductMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    console.log(`Starting media upload for ${files.length} files, product:`, productId);

    try {
      await verifyProductOwnership(productId);
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
        const { filePath, mediaType, fileName } = await uploadMediaFile(file, productId);
        await createMediaRecord(
          productId,
          filePath,
          mediaType,
          fileName,
          media.length === 0 && fileArray.indexOf(file) === 0
        );
      }

      toast({ description: `Successfully uploaded ${fileArray.length} files` });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Media upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload media. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (mediaId: string, filePath: string) => {
    if (!user) return;

    try {
      await verifyProductOwnership(productId);
      
      console.log("Deleting media:", mediaId);
      await deleteMediaRecord(mediaId);
      await deleteMediaFile(filePath);

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
      await updatePrimaryStatus(productId, mediaId);

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
    fetchMedia,
    handleFileUpload,
    handleDelete,
    setPrimaryMedia,
  };
};