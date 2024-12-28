import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useGalleryActions = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteImages = async (imageIds: string[]) => {
    if (!imageIds.length) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("product_media")
        .delete()
        .in("id", imageIds);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({ description: "Images deleted successfully" });
    } catch (error) {
      console.error("Error deleting images:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete images",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteImages,
    isDeleting,
  };
};