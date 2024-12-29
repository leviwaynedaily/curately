import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../types";
import { ProductTableSection } from "./ProductTableSection";
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
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
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

  return (
    <div className="space-y-4">
      <ProductTableSection
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