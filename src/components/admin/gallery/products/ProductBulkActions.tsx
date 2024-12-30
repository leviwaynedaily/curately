import { Product } from "./types";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

type ProductBulkActionsProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => Promise<void>;
  onDelete: (productIds: string[]) => Promise<void>;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
};

export const ProductBulkActions = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
  onSelectAll,
}: ProductBulkActionsProps) => {
  const handleDelete = async () => {
    const productIds = Array.from(selectedProducts);
    await onDelete(productIds);
  };

  const handleDuplicate = async () => {
    const productIds = Array.from(selectedProducts);
    await onDuplicate(productIds);
  };

  console.log("ProductBulkActions render:", {
    selectedCount: selectedProducts.size,
    totalProducts: products.length
  });

  if (selectedProducts.size === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {selectedProducts.size} selected
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDuplicate}
        className="flex items-center gap-2"
      >
        <Copy className="h-4 w-4" />
        Duplicate
      </Button>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        className="flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
};