import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gallery } from "@/types/gallery";

export const useGallery = (galleryId: string | undefined) => {
  return useQuery({
    queryKey: ["gallery", galleryId],
    queryFn: async () => {
      if (!galleryId) {
        console.log("No gallery ID provided");
        throw new Error("Gallery ID is required");
      }

      console.log("Fetching gallery details for ID:", galleryId);
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          id,
          name,
          password,
          businesses (
            name
          ),
          gallery_images (
            id,
            file_path,
            title,
            description,
            media_type,
            price,
            is_featured
          )
        `)
        .eq("id", galleryId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }

      if (!data) {
        console.log("No gallery found with ID:", galleryId);
        throw new Error("Gallery not found");
      }

      console.log("Fetched gallery:", data);
      return data as Gallery;
    },
    enabled: !!galleryId,
  });
};