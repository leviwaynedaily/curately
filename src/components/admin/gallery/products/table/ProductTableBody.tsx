import { TableBody } from "@/components/ui/table";
import { ProductTableRow } from "../ProductTableRow";
import { Product } from "../types";
import { tableStyles } from "./TableStyles";

type ProductTableBodyProps = {
  products: Product[];
  editingId: string | null;
  editedProduct: Product | null;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onProductChange: (field: keyof Product, value: any) => void;
  onMediaClick: (product: Product) => void;
  showHiddenFields: boolean;
  selectedProducts: Set<string>;
  onToggleProduct: (productId: string) => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableBody = ({
  products,
  editingId,
  editedProduct,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onProductChange,
  onMediaClick,
  showHiddenFields,
  selectedProducts,
  onToggleProduct,
  onDuplicate,
}: ProductTableBodyProps) => {
  return (
    <TableBody>
      {products.map((product, index) => (
        <ProductTableRow
          key={product.id}
          product={product}
          isEditing={editingId === product.id}
          editedProduct={editedProduct}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onProductChange={onProductChange}
          onMediaClick={onMediaClick}
          showHiddenFields={showHiddenFields}
          className={index % 2 === 1 ? tableStyles.alternateRow : ""}
          selected={selectedProducts.has(product.id)}
          onToggleSelect={() => onToggleProduct(product.id)}
          onDuplicate={onDuplicate}
        />
      ))}
    </TableBody>
  );
};