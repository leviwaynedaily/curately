import { ProductBulkActions } from "../ProductBulkActions";
import { Product } from "../types";

type ProductTableActionsProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => Promise<void>;
  onDelete: (productIds: string[]) => Promise<void>;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
};

export const ProductTableActions = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
  onSelectAll,
}: ProductTableActionsProps) => {
  console.log("ProductTableActions render:", {
    selectedCount: selectedProducts.size,
    totalProducts: products.length
  });

  if (selectedProducts.size === 0 && products.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <ProductBulkActions
        selectedProducts={selectedProducts}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        products={products}
        onSelectAll={onSelectAll}
      />
    </div>
  );
};