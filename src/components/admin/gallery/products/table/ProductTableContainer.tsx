import { useState } from "react";
import { Table } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductTableHeader } from "../ProductTableHeader";
import { ProductTableBody } from "./ProductTableBody";
import { Product } from "../types";
import { Input } from "@/components/ui/input";
import { ProductBulkActions } from "./ProductBulkActions";
import { ProductMediaDialog } from "../ProductMediaDialog";

type ProductTableContainerProps = {
  storefrontId: string;
  products: Product[];
  onProductUpdate: () => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableContainer = ({
  storefrontId,
  products,
  onProductUpdate,
  onDuplicate,
}: ProductTableContainerProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleToggleProduct = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  const handleBulkDelete = async (productIds: string[]) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", productIds);

      if (error) throw error;

      toast({ description: "Products deleted successfully" });
      setSelectedProducts(new Set());
      onProductUpdate();
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete products",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct(product);
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    setEditedProduct((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleSave = async () => {
    if (!editedProduct) return;
    
    try {
      console.log("Saving product update:", editedProduct);
      
      // Only send the fields that can be updated
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

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            showHiddenFields={showHiddenFields}
            onToggleHiddenFields={() => setShowHiddenFields(!showHiddenFields)}
            allSelected={selectedProducts.size === products.length}
            onSelectAll={handleSelectAll}
          />
          <ProductTableBody
            products={filteredAndSortedProducts}
            editingId={editingId}
            editedProduct={editedProduct}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={() => {
              setEditingId(null);
              setEditedProduct(null);
            }}
            onDelete={(id) => handleBulkDelete([id])}
            onProductChange={handleProductChange}
            onMediaClick={setSelectedProduct}
            showHiddenFields={showHiddenFields}
            selectedProducts={selectedProducts}
            onToggleProduct={handleToggleProduct}
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