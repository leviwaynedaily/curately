import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Loader2, Trash, Edit } from "lucide-react";
import { Product } from "../types";
import { BulkActionButton } from "./bulk-actions/BulkActionButton";
import { BulkCategoryUpdate } from "./bulk-actions/BulkCategoryUpdate";

type ProductBulkActionsProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
  products: Product[];
};

export const ProductBulkActions = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
}: ProductBulkActionsProps) => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const { toast } = useToast();

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  const handleDuplicate = async () => {
    console.log("Duplicating selected products:", Array.from(selectedProducts));
    setIsDuplicating(true);
    try {
      await onDuplicate(Array.from(selectedProducts));
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    console.log("Deleting selected products:", Array.from(selectedProducts));
    setIsDeleting(true);
    try {
      await onDelete(Array.from(selectedProducts));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkUpdateCategory = async (category: string) => {
    console.log("Updating category for products:", Array.from(selectedProducts));
    if (!category.trim()) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({ category })
        .in("id", Array.from(selectedProducts));

      if (error) throw error;

      toast({ description: `Successfully updated category for ${selectedProducts.size} products` });
      setShowCategoryDialog(false);
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error("Error updating products:", error);
      toast({
        variant: "destructive",
        description: "Failed to update products",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Only render if there are products and some are selected
  if (products.length === 0 || selectedProducts.size === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <BulkActionButton selectedCount={selectedProducts.size} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            onClick={handleDuplicate}
            disabled={isDuplicating}
            className="flex items-center"
          >
            {isDuplicating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Duplicating...
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowCategoryDialog(true)}
            disabled={isUpdating}
            className="flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Change Category
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-destructive flex items-center"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <BulkCategoryUpdate
        categories={categories}
        isUpdating={isUpdating}
        onUpdateCategory={handleBulkUpdateCategory}
        showDialog={showCategoryDialog}
        setShowDialog={setShowCategoryDialog}
      />
    </div>
  );
};