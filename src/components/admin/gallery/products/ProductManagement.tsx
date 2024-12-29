import { useState } from "react";
import { ProductTableContainer } from "./table/ProductTableContainer";
import { useProducts } from "@/hooks/useProducts";
import { ProductTableToolbar } from "./table/ProductTableToolbar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProductManagementProps = {
  storefrontId: string;
};

export const ProductManagement = ({ storefrontId }: ProductManagementProps) => {
  const { products, isLoading, refetch } = useProducts(storefrontId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    // Export logic here
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Import logic here
  };

  const handleDuplicateProducts = async (productIds: string[]) => {
    try {
      console.log("Duplicating products:", productIds);
      
      for (const productId of productIds) {
        const product = products.find(p => p.id === productId);
        if (!product) {
          console.error("Product not found:", productId);
          continue;
        }

        // Create a copy of the product without id and timestamps
        const productCopy = {
          storefront_id: product.storefront_id,
          name: `${product.name} (Copy)`,
          description: product.description,
          price: product.price,
          sku: product.sku,
          category: product.category,
          status: product.status,
          stock_quantity: product.stock_quantity
        };

        const { data: newProduct, error } = await supabase
          .from("products")
          .insert(productCopy)
          .select()
          .single();

        if (error) {
          console.error("Error duplicating product:", error);
          throw error;
        }

        console.log("Product duplicated successfully:", newProduct);
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <ProductTableToolbar
        onExport={handleExport}
        onImport={handleImport}
        onAddProduct={() => setIsFormOpen(true)}
      />
      <ProductTableContainer
        storefrontId={storefrontId}
        products={products}
        onProductUpdate={refetch}
        onDuplicate={handleDuplicateProducts}
      />
    </div>
  );
};