import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useBulkActions = (
  selectedProducts: Set<string>,
  onDelete: (productIds: string[]) => Promise<void>,
  onDuplicate: (productIds: string[]) => Promise<void>
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const { toast } = useToast();

  const handleDuplicate = async () => {
    console.log("Duplicating selected products:", Array.from(selectedProducts));
    setIsDuplicating(true);
    try {
      await onDuplicate(Array.from(selectedProducts));
      toast({ description: `Successfully duplicated ${selectedProducts.size} products` });
    } catch (error) {
      console.error("Error duplicating products:", error);
      toast({
        variant: "destructive",
        description: "Failed to duplicate products",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    console.log("Deleting selected products:", Array.from(selectedProducts));
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products? This action cannot be undone.`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(Array.from(selectedProducts));
      toast({ description: `Successfully deleted ${selectedProducts.size} products` });
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete products",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    isDuplicating,
    handleDelete,
    handleDuplicate,
  };
};