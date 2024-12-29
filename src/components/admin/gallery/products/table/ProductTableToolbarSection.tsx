import { Input } from "@/components/ui/input";
import { ProductBulkActions } from "./ProductBulkActions";
import { Product } from "../types";

type ProductTableToolbarSectionProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
};

export const ProductTableToolbarSection = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
  onSelectAll,
  searchTerm,
  setSearchTerm,
}: ProductTableToolbarSectionProps) => {
  return (
    <div className="flex items-center gap-4">
      <ProductBulkActions
        selectedProducts={selectedProducts}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        products={products}
        onSelectAll={onSelectAll}
      />
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};