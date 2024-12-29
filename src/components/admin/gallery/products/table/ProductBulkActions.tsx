import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";
import { Product } from "../types";

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

  if (products.length === 0) return null;

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
    </div>
  );
};