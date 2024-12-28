import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

  const verifyProductOwnership = async () => {
    if (!user) {
      throw new Error("No authenticated user found");
    }

    console.log("Verifying product ownership for:", productId);
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        storefront:storefronts!inner(
          id,
          business:businesses!inner(
            id,
            owner_id
          )
        )
      `)
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error verifying product ownership:", error);
      throw new Error("Failed to verify product ownership");
    }

    if (!data || data.storefront.business.owner_id !== user.id) {
      console.error("Unauthorized: User does not own this product");
      throw new Error("Unauthorized: You don't have permission to modify this product");
    }

    return true;
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
      // Verify ownership before proceeding with upload
      await verifyProductOwnership();
      
      const fileArray = Array.from(files);
      
      for (const file of fileArray) {
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
      await verifyProductOwnership();
      
      console.log("Deleting media:", mediaId);
      const { error: dbError } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (dbError) throw dbError;

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
      await verifyProductOwnership();
      
      console.log("Setting primary media:", mediaId);
      await supabase
        .from("product_media")
        .update({ is_primary: false })
        .eq("product_id", productId);

      const { error } = await supabase
        .from("product_media")
        .update({ is_primary: true })
        .eq("id", mediaId);

      if (error) throw error;

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