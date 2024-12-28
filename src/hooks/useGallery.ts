import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Storefront } from "@/types/storefront";
import { useToast } from "@/components/ui/use-toast";

export const useGallery = (galleryId: string | undefined) => {
  const { toast } = useToast();

  const { data: gallery, isLoading, error, refetch } = useQuery({
    queryKey: ["storefront", galleryId],
    queryFn: async () => {
      if (!galleryId) {
        console.log("No storefront ID provided");
        throw new Error("Storefront ID is required");
      }

      console.log("Fetching storefront details for ID:", galleryId);
      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          id,
          name,
          password,
          businesses (
            name
          ),
          logo,
          site_logo,
          description,
          primary_color,
          secondary_color,
          accent_color,
          heading_text,
          subheading_text,
          age_verification_message,
          button_text,
          age_verification_enabled,
          primary_font_color,
          secondary_font_color,
          accent_font_color,
          password_required
        `)
        .eq("id", galleryId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      if (!data) {
        console.log("No storefront found with ID:", galleryId);
        return null;
      }

      console.log("Successfully fetched storefront:", data);
      return data as Storefront;
    },
    retry: false,
  });

  const deleteImage = async (image: { id: string; filePath: string }) => {
    try {
      console.log("Deleting image:", image);
      const { error } = await supabase
        .from("product_media")
        .delete()
        .eq("id", image.id);

      if (error) throw error;

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
    error,
    deleteImage,
    refetchGallery: refetch,
  };
};
