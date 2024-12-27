import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Gallery } from "@/types/gallery";
import { useToast } from "@/components/ui/use-toast";

export const useGallery = (galleryId: string | undefined) => {
  const { toast } = useToast();

  const { data: gallery, isLoading, refetch } = useQuery({
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

  const deleteImage = async (image: { id: string; filePath: string }) => {
    try {
      console.log("Deleting image:", image);
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

      // Also delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([image.filePath]);

      if (storageError) {
        console.error("Error deleting image from storage:", storageError);
        toast({
          title: "Error",
          description: "Failed to delete image from storage",
          variant: "destructive",
        });
      }

      toast({
        description: "Image deleted successfully",
      });
      
      refetch();
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  return {
    gallery,
    isLoading,
    deleteImage,
    refetchGallery: refetch,
  };
};