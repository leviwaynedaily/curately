import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Copy, Loader2, MoreHorizontal, Trash, Edit } from "lucide-react";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type ProductBulkActionsProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
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
  const [newCategory, setNewCategory] = useState("");
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

  if (products.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {selectedProducts.size > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions ({selectedProducts.size})
            </Button>
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

            <DropdownMenuSeparator />

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
      )}

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Category</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Select onValueChange={handleBulkUpdateCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Or create a new category:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button 
                  onClick={() => handleBulkUpdateCategory(newCategory)}
                  disabled={!newCategory.trim() || isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create & Apply"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};