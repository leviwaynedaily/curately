import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useMediaOperations } from "./useMediaOperations";
import { useMediaUpload } from "./useMediaUpload";

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
  const { handleDelete, setPrimaryMedia } = useMediaOperations(productId, () => {
    onMediaUpdate();
    fetchMedia();
  });
  const { isLoading, uploadProgress, handleFileUpload } = useMediaUpload(productId, () => {
    onMediaUpdate();
    fetchMedia();
  });

  const fetchMedia = async () => {
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