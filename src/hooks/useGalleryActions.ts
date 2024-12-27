import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useGalleryActions = (galleryId: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDeleteImage = async (image: { id: string; filePath: string }) => {
    console.log("Deleting image:", image);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([image.filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (dbError) {
        console.error("Error deleting from database:", dbError);
        throw dbError;
      }

      console.log("Image deleted successfully");
      toast({ description: "Image deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete image. Please try again.",
      });
    }
  };

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] });
  };

  return {
    handleDeleteImage,
    handleUploadComplete,
  };
};