import { useProducts } from "@/hooks/useProducts";
import { ProductTableHeader } from "./table/ProductTableHeader";
import { ProductTableContent } from "./table/ProductTableContent";
import { ProductTableToolbar } from "./table/ProductTableToolbar";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "../gallery/products/types";
import { supabase } from "@/integrations/supabase/client";

type NewProductTableProps = {
  storefrontId: string;
};

export const NewProductTable = ({ storefrontId }: NewProductTableProps) => {
  const { products, isLoading, refetch } = useProducts(storefrontId);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleBulkDelete = async (productIds: string[]) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .in("id", productIds);

      if (error) throw error;

      toast({ description: "Products deleted successfully" });
      setSelectedProducts(new Set());
      refetch();
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete products",
      });
    }
  };

  const handleDuplicate = async (productIds: string[]) => {
    try {
      const productsToClone = products.filter(p => productIds.includes(p.id));
      
      for (const product of productsToClone) {
        const { error } = await supabase
          .from("products")
          .insert({
            ...product,
            id: undefined,
            name: `${product.name} (Copy)`,
            storefront_id: storefrontId,
          });

        if (error) throw error;
      }

      toast({ description: "Products duplicated successfully" });
      refetch();
    } catch (error) {
      console.error("Error duplicating products:", error);
      toast({
        variant: "destructive",
        description: "Failed to duplicate products",
      });
    }
  };

  const handleProductUpdate = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update(product)
        .eq("id", product.id);

      if (error) throw error;

      toast({ description: "Product updated successfully" });
      refetch();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to update product",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ProductTableToolbar
        selectedProducts={selectedProducts}
        onDuplicate={handleDuplicate}
        onDelete={handleBulkDelete}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <div className="bg-white rounded-lg border shadow-sm">
        <ProductTableHeader
          products={products}
          selectedProducts={selectedProducts}
          onSelectAll={(checked) => {
            if (checked) {
              setSelectedProducts(new Set(products.map(p => p.id)));
            } else {
              setSelectedProducts(new Set());
            }
          }}
        />
        
        <ProductTableContent
          products={products}
          isLoading={isLoading}
          selectedProducts={selectedProducts}
          onToggleSelect={(productId) => {
            const newSelection = new Set(selectedProducts);
            if (newSelection.has(productId)) {
              newSelection.delete(productId);
            } else {
              newSelection.add(productId);
            }
            setSelectedProducts(newSelection);
          }}
          onUpdate={handleProductUpdate}
        />
      </div>
    </div>
  );
};