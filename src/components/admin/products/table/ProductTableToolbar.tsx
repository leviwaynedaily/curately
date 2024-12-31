import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Copy } from "lucide-react";

type ProductTableToolbarProps = {
  selectedProducts: Set<string>;
  onDelete: (productIds: string[]) => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableToolbar = ({
  selectedProducts,
  onDelete,
  onDuplicate,
}: ProductTableToolbarProps) => {
  const handleDelete = () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} products?`)) return;
    onDelete(Array.from(selectedProducts));
  };

  const handleDuplicate = () => {
    onDuplicate(Array.from(selectedProducts));
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search products..."
          className="w-[300px]"
        />
      </div>
      {selectedProducts.size > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedProducts.size} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
          >
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive"
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};