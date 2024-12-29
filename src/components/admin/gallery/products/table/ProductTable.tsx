import { Table } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ProductTableHeader } from "../ProductTableHeader";
import { ProductTableBody } from "./ProductTableBody";
import { Product } from "../types";
import { ProductBulkActions } from "./ProductBulkActions";
import { ProductMediaDialog } from "../ProductMediaDialog";

type ProductTableProps = {
  products: Product[];
  editingId: string | null;
  editedProduct: Product | null;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  sortField: keyof Product | null;
  sortDirection: "asc" | "desc" | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showHiddenFields: boolean;
  setShowHiddenFields: (show: boolean) => void;
  selectedProducts: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onToggleProduct: (productId: string) => void;
  onBulkDelete: (productIds: string[]) => void;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onProductChange: (field: keyof Product, value: any) => void;
  onSort: (field: keyof Product) => void;
  onDuplicate: (productIds: string[]) => void;
  onProductUpdate: () => void;
};

export const ProductTable = ({
  products,
  editingId,
  editedProduct,
  selectedProduct,
  setSelectedProduct,
  sortField,
  sortDirection,
  searchTerm,
  setSearchTerm,
  showHiddenFields,
  setShowHiddenFields,
  selectedProducts,
  onSelectAll,
  onToggleProduct,
  onBulkDelete,
  onEdit,
  onSave,
  onCancel,
  onProductChange,
  onSort,
  onDuplicate,
  onProductUpdate,
}: ProductTableProps) => {
  // Create a wrapper function to convert single ID to array for deletion
  const handleSingleDelete = (id: string) => {
    onBulkDelete([id]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ProductBulkActions
          selectedProducts={selectedProducts}
          onDuplicate={onDuplicate}
          onDelete={onBulkDelete}
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

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <ProductTableHeader
            onSort={onSort}
            sortField={sortField}
            sortDirection={sortDirection}
            showHiddenFields={showHiddenFields}
            onToggleHiddenFields={() => setShowHiddenFields(!showHiddenFields)}
            allSelected={selectedProducts.size === products.length}
            onSelectAll={onSelectAll}
          />
          <ProductTableBody
            products={products}
            editingId={editingId}
            editedProduct={editedProduct}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={handleSingleDelete}
            onProductChange={onProductChange}
            onMediaClick={setSelectedProduct}
            showHiddenFields={showHiddenFields}
            selectedProducts={selectedProducts}
            onToggleProduct={onToggleProduct}
            onDuplicate={onDuplicate}
          />
        </Table>
      </div>

      {selectedProduct && (
        <ProductMediaDialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onMediaUpdate={onProductUpdate}
        />
      )}
    </div>
  );
};