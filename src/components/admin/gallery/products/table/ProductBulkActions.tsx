import { Product } from "../types";
import { BulkActionMenu } from "./bulk-actions/BulkActionMenu";
import { useBulkActions } from "./bulk-actions/useBulkActions";

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
  const {
    isDeleting,
    isDuplicating,
    handleDelete,
    handleDuplicate,
  } = useBulkActions(selectedProducts, onDelete, onDuplicate);

  console.log("ProductBulkActions render:", {
    selectedCount: selectedProducts.size,
    totalProducts: products.length
  });

  if (selectedProducts.size === 0 && products.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <BulkActionMenu
        selectedCount={selectedProducts.size}
        isDeleting={isDeleting}
        isDuplicating={isDuplicating}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
      />
    </div>
  );
};