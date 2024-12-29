import { useProductTableState } from "../hooks/useProductTableState";
import { filterAndSortProducts } from "../utils/productTableUtils";
import { ProductTableToolbarSection } from "./ProductTableToolbarSection";
import { ProductTableSection } from "./ProductTableSection";
import { ProductMediaDialog } from "../ProductMediaDialog";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProductTableContainerProps = {
  storefrontId: string;
  products: Product[];
  onProductUpdate: () => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableContainer = ({
  products,
  onProductUpdate,
  onDuplicate,
}: ProductTableContainerProps) => {
  const { toast } = useToast();
  const {
    editingId,
    setEditingId,
    editedProduct,
    setEditedProduct,
    selectedProduct,
    setSelectedProduct,
    sortField,
    sortDirection,
    searchTerm,
    setSearchTerm,
    showHiddenFields,
    setShowHiddenFields,
    selectedProducts,
    handleSelectAll,
    handleToggleProduct,
    handleBulkDelete,
    handleEdit,
    handleProductChange,
    handleSort,
  } = useProductTableState(products, onProductUpdate);

  const handleSave = async () => {
    if (!editedProduct) return;
    
    try {
      console.log("Saving product update:", editedProduct);
      
      const updateData = {
        name: editedProduct.name,
        description: editedProduct.description,
        price: editedProduct.price,
        sku: editedProduct.sku,
        category: editedProduct.category,
        stock_quantity: editedProduct.stock_quantity,
        status: editedProduct.status
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', editedProduct.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Product updated successfully");
      toast({ description: "Product updated successfully" });
      setEditingId(null);
      setEditedProduct(null);
      onProductUpdate();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        description: "Failed to update product"
      });
    }
  };

  const filteredAndSortedProducts = filterAndSortProducts(
    products,
    searchTerm,
    sortField,
    sortDirection
  );

  return (
    <div className="space-y-4">
      <ProductTableToolbarSection
        selectedProducts={selectedProducts}
        onDuplicate={onDuplicate}
        onDelete={handleBulkDelete}
        products={products}
        onSelectAll={handleSelectAll}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ProductTableSection
        products={filteredAndSortedProducts}
        editingId={editingId}
        editedProduct={editedProduct}
        showHiddenFields={showHiddenFields}
        selectedProducts={selectedProducts}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onToggleHiddenFields={() => setShowHiddenFields(!showHiddenFields)}
        onSelectAll={handleSelectAll}
        onToggleProduct={handleToggleProduct}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={() => {
          setEditingId(null);
          setEditedProduct(null);
        }}
        onDelete={(id) => handleBulkDelete([id])}
        onProductChange={handleProductChange}
        onMediaClick={setSelectedProduct}
        onDuplicate={onDuplicate}
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