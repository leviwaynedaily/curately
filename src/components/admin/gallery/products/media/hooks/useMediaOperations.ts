import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProductMedia } from "./useProductMedia";
import { useProductOwnership } from "./useProductOwnership";

export const useMediaOperations = (productId: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const { verifyProductOwnership } = useProductOwnership();

  const handleDelete = async (mediaId: string, filePath: string) => {
    try {
      await verifyProductOwnership(productId);
      
      console.log("Deleting media:", mediaId);
      const { error: deleteError } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (deleteError) throw deleteError;

      const { error: storageError } = await supabase.storage
        .from("storefront_products")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      toast({ description: "Media deleted successfully" });
      onSuccess();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete media",
      });
    }
  };

  const setPrimaryMedia = async (mediaId: string) => {
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
      onSuccess();
    } catch (error) {
      console.error("Error updating primary media:", error);
      toast({
        variant: "destructive",
        description: "Failed to update primary media",
      });
    }
  };

  return {
    handleDelete,
    setPrimaryMedia,
  };
};