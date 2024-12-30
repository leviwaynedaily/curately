import { Product } from "../types";
import { BulkActionMenu } from "./bulk-actions/BulkActionMenu";
import { useBulkActions } from "./bulk-actions/useBulkActions";

type ProductBulkActionsProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => Promise<void>;
  onDelete: (productIds: string[]) => Promise<void>;
  products: Product[];
};

export const ProductBulkActions = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
}: ProductBulkActionsProps) => {
  const {
    isDeleting,
    isDuplicating,
    handleDelete,
    handleDuplicate,
  } = useBulkActions(selectedProducts, onDelete, onDuplicate);

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