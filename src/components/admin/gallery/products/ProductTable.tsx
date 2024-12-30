import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductMediaDialog } from "./ProductMediaDialog";
import { ProductTablePagination } from "./table/pagination/ProductTablePagination";
import { useProductTableState } from "./hooks/useProductTableState";
import { useKeyboardDelete } from "./hooks/useKeyboardDelete";
import { ProductTableActions } from "./table/ProductTableActions";
import { ProductTableContent } from "./table/ProductTableContent";
import { Product } from "./types";

type ProductTableProps = {
  storefrontId: string;
  products: Product[];
  onProductUpdate: () => void;
  onDuplicate: (productIds: string[]) => Promise<void>;
};

export const ProductTable = ({
  storefrontId,
  products,
  onProductUpdate,
  onDuplicate,
}: ProductTableProps) => {
  const {
    editingId,
    setEditingId,
    editedProduct,
    setEditedProduct,
    selectedProduct,
    setSelectedProduct,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    searchTerm,
    setSearchTerm,
    showHiddenFields,
    setShowHiddenFields,
    selectedProducts,
    selectedCategory,
    setSelectedCategory,
    selectedTag,
    setSelectedTag,
    page,
    setPage,
    pageSize,
    setPageSize,
    handleSelectAll,
    handleToggleProduct,
  } = useProductTableState(products);
  
  const { toast } = useToast();

  const handleBulkDelete = async (productIds: string[]): Promise<void> => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", productIds);

      if (error) throw error;

      toast({ description: "Products deleted successfully" });
      onProductUpdate();
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete products",
      });
    }
  };

  const handleSingleDelete = async (id: string): Promise<void> => {
    return handleBulkDelete([id]);
  };

  // Use the keyboard delete hook
  useKeyboardDelete(selectedProducts, handleBulkDelete);

  console.log("ProductTable render:", {
    selectedProducts: selectedProducts.size,
    products: products.length,
    showHiddenFields
  });

  return (
    <div className="space-y-4">
      <ProductTableActions
        selectedProducts={selectedProducts}
        onDuplicate={onDuplicate}
        onDelete={handleBulkDelete}
        products={products}
        onSelectAll={handleSelectAll}
      />

      <ProductTableContent
        products={products}
        editingId={editingId}
        editedProduct={editedProduct}
        showHiddenFields={showHiddenFields}
        selectedProducts={selectedProducts}
        sortField={sortField}
        sortDirection={sortDirection}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        onSort={setSortField}
        onToggleHiddenFields={() => setShowHiddenFields(!showHiddenFields)}
        onSelectAll={handleSelectAll}
        onToggleProduct={handleToggleProduct}
        onEdit={(product) => {
          setEditingId(product.id);
          setEditedProduct(product);
        }}
        onSave={() => {
          setEditingId(null);
          setEditedProduct(null);
          onProductUpdate();
        }}
        onCancel={() => {
          setEditingId(null);
          setEditedProduct(null);
        }}
        onDelete={handleSingleDelete}
        onProductChange={(field, value) => {
          setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
        }}
        onMediaClick={setSelectedProduct}
        onDuplicate={onDuplicate}
      />

      <ProductTablePagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={Math.ceil(products.length / pageSize)}
      />

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