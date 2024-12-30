import { useProducts } from "@/hooks/useProducts";
import { ProductTableContent } from "./table/ProductTableContent";
import { ProductTableToolbar } from "./table/ProductTableToolbar";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const NewProductTable = ({ storefrontId }: { storefrontId: string }) => {
  const { products, isLoading, refetch } = useProducts(storefrontId);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
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

  const handleBulkDuplicate = async (productIds: string[]) => {
    try {
      for (const productId of productIds) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            ...product,
            id: undefined,
            name: `${product.name} (Copy)`,
            created_at: undefined,
            updated_at: undefined
          })
          .select()
          .single();

        if (productError) throw productError;

        // Duplicate media if exists
        const { data: mediaData } = await supabase
          .from("product_media")
          .select("*")
          .eq("product_id", productId);

        if (mediaData) {
          for (const media of mediaData) {
            const { error: mediaError } = await supabase
              .from("product_media")
              .insert({
                ...media,
                id: undefined,
                product_id: newProduct.id,
                created_at: undefined,
                updated_at: undefined
              });

            if (mediaError) throw mediaError;
          }
        }
      }

      toast({ description: "Products duplicated successfully" });
      setSelectedProducts(new Set());
      refetch();
    } catch (error) {
      console.error("Error duplicating products:", error);
      toast({
        variant: "destructive",
        description: "Failed to duplicate products",
      });
    }
  };

  return (
    <div className="space-y-4">
      <ProductTableToolbar
        selectedProducts={selectedProducts}
        onDelete={handleBulkDelete}
        onDuplicate={handleBulkDuplicate}
      />
      <ProductTableContent
        products={products}
        isLoading={isLoading}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
        onRefetch={refetch}
      />
    </div>
  );
};