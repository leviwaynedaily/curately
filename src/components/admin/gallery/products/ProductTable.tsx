import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductTableHeader } from "./ProductTableHeader";
import { ProductTableBody } from "./table/ProductTableBody";
import { Product } from "./types";
import { ProductBulkActions } from "./table/ProductBulkActions";
import { ProductMediaDialog } from "./ProductMediaDialog";
import { ProductTablePagination } from "./table/pagination/ProductTablePagination";
import { useProductTableState } from "./hooks/useProductTableState";
import { useEffect } from "react";

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

  const handleBulkDelete = async (productIds: string[]) => {
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

  // Create a wrapper function to convert single ID to array
  const handleSingleDelete = async (id: string) => {
    return handleBulkDelete([id]);
  };

  // Add keyboard event listener for delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Delete key is pressed and there are selected products
      if (e.key === 'Delete' && selectedProducts.size > 0) {
        console.log('Delete key pressed with selected products:', Array.from(selectedProducts));
        // Confirm before deleting
        if (window.confirm(`Are you sure you want to delete ${selectedProducts.size} selected products?`)) {
          handleBulkDelete(Array.from(selectedProducts));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProducts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <ProductBulkActions
          selectedProducts={selectedProducts}
          onDuplicate={onDuplicate}
          onDelete={handleBulkDelete}
          products={products}
          onSelectAll={handleSelectAll}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <ProductTableHeader
            onSort={setSortField}
            sortField={sortField}
            sortDirection={sortDirection}
            showHiddenFields={showHiddenFields}
            onToggleHiddenFields={() => setShowHiddenFields(!showHiddenFields)}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
          <TableBody>
            <ProductTableBody
              products={products}
              editingId={editingId}
              editedProduct={editedProduct}
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
              showHiddenFields={showHiddenFields}
              selectedProducts={selectedProducts}
              onToggleProduct={handleToggleProduct}
              onDuplicate={onDuplicate}
            />
          </TableBody>
        </Table>
      </div>

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