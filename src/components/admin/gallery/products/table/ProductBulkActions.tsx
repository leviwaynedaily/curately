import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
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
  if (products.length === 0) return null;

  const handleDuplicate = () => {
    console.log("Duplicating selected products:", Array.from(selectedProducts));
    onDuplicate(Array.from(selectedProducts));
  };

  const handleDelete = () => {
    console.log("Deleting selected products:", Array.from(selectedProducts));
    onDelete(Array.from(selectedProducts));
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
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};