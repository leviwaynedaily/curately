import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../types";
import { ProductTableToolbarSection } from "./ProductTableToolbarSection";
import { ProductTableSection } from "./ProductTableSection";
import { ProductMediaDialog } from "../ProductMediaDialog";

type ProductTableContainerProps = {
  storefrontId: string;  // Added this prop
  products: Product[];
  onProductUpdate: () => void;
  onDuplicate: (productIds: string[]) => void;
};

export const ProductTableContainer = ({
  storefrontId,  // Added this prop
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
  const [statusFilter, setStatusFilter] = useState("all");
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || product.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <ProductTableSection
        products={filteredProducts}
        editingId={editingId}
        editedProduct={editedProduct}
        showHiddenFields={showHiddenFields}
        selectedProducts={selectedProducts}
        sortField={sortField}
        sortDirection={sortDirection}
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
        onDelete={(id) => handleBulkDelete([id])}
        onProductChange={(field, value) => {
          setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
        }}
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