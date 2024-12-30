import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Copy, Trash2 } from "lucide-react";

type ProductTableToolbarProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

export const ProductTableToolbar = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  searchTerm,
  onSearchChange,
}: ProductTableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {selectedProducts.size > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              {selectedProducts.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDuplicate(Array.from(selectedProducts))}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(Array.from(selectedProducts))}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        )}
      </div>
      
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
    </div>
  );
};