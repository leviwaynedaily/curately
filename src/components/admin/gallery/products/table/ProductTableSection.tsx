import { Table } from "@/components/ui/table";
import { ProductTableHeader } from "../ProductTableHeader";
import { ProductTableBody } from "./ProductTableBody";
import { Product } from "../types";

type ProductTableSectionProps = {
  products: Product[];
  editingId: string | null;
  editedProduct: Product | null;
  showHiddenFields: boolean;
  selectedProducts: Set<string>;
  sortField: keyof Product | null;
  sortDirection: "asc" | "desc" | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSort: (field: keyof Product) => void;
  onToggleHiddenFields: () => void;
  onSelectAll: (checked: boolean) => void;
  onToggleProduct: (productId: string) => void;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onProductChange: (field: keyof Product, value: any) => void;
  onMediaClick: (product: Product) => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableSection = ({
  products,
  editingId,
  editedProduct,
  showHiddenFields,
  selectedProducts,
  sortField,
  sortDirection,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onSort,
  onToggleHiddenFields,
  onSelectAll,
  onToggleProduct,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onProductChange,
  onMediaClick,
  onDuplicate,
}: ProductTableSectionProps) => {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <ProductTableHeader
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          showHiddenFields={showHiddenFields}
          onToggleHiddenFields={onToggleHiddenFields}
          allSelected={selectedProducts.size === products.length}
          onSelectAll={onSelectAll}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          products={products}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <ProductTableBody
          products={products}
          editingId={editingId}
          editedProduct={editedProduct}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          onProductChange={onProductChange}
          onMediaClick={onMediaClick}
          showHiddenFields={showHiddenFields}
          selectedProducts={selectedProducts}
          onToggleProduct={onToggleProduct}
          onDuplicate={onDuplicate}
        />
      </Table>
    </div>
  );
};