import { useState } from "react";
import { Product } from "../types";
import { ProductTable } from "./ProductTable";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const handleSave = async () => {
    if (!editedProduct) return;
    
    try {
      const { error } = await supabase
        .from("products")
        .update(editedProduct)
        .eq("id", editedProduct.id);

      if (error) throw error;

      toast({ description: "Product updated successfully" });
      setEditingId(null);
      setEditedProduct(null);
      onProductUpdate();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to update product",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    setEditedProduct((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
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
    <ProductTable
      products={filteredAndSortedProducts}
      editingId={editingId}
      editedProduct={editedProduct}
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
      sortField={sortField}
      sortDirection={sortDirection}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      showHiddenFields={showHiddenFields}
      setShowHiddenFields={setShowHiddenFields}
      selectedProducts={selectedProducts}
      onSelectAll={handleSelectAll}
      onToggleProduct={handleToggleProduct}
      onBulkDelete={handleBulkDelete}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onProductChange={handleProductChange}
      onSort={handleSort}
      onDuplicate={onDuplicate}
      onProductUpdate={onProductUpdate}
    />
  );
};