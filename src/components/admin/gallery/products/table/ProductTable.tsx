import { Table } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductTableHeader } from "../ProductTableHeader";
import { ProductTableBody } from "./ProductTableBody";
import { Product } from "../types";
import { ProductBulkActions } from "./ProductBulkActions";
import { ProductMediaDialog } from "../ProductMediaDialog";
import { ProductTablePagination } from "./pagination/ProductTablePagination";
import { useProductTableState } from "../hooks/useProductTableState";

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
    sortDirection,
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
    handleSort,
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

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesTag = !selectedTag || (product.tags && product.tags.some(tag => tag.name === selectedTag));

      return matchesSearch && matchesCategory && matchesTag;
    })
    .sort((a, b) => {
      if (sortField) {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = 
          typeof aValue === 'string' 
            ? aValue.localeCompare(bValue as string)
            : (aValue as number) - (bValue as number);

        return sortDirection === "asc" ? comparison : -comparison;
      }
      return 0;
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);

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
            onSort={handleSort}
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
          <ProductTableBody
            products={paginatedProducts}
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
            onDelete={(id) => handleBulkDelete([id])}
            onProductChange={(field, value) => {
              setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
            }}
            onMediaClick={setSelectedProduct}
            showHiddenFields={showHiddenFields}
            selectedProducts={selectedProducts}
            onToggleProduct={handleToggleProduct}
            onDuplicate={onDuplicate}
          />
        </Table>
      </div>

      <ProductTablePagination
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
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