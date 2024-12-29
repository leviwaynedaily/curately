import { useState } from "react";
import { ProductTable } from "./ProductTable";
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
      for (const productId of productIds) {
        const product = products.find(p => p.id === productId);
        if (!product) continue;

        const { data: newProduct, error } = await supabase
          .from("products")
          .insert({
            ...product,
            id: undefined,
            name: `${product.name} (Copy)`,
            created_at: undefined,
            updated_at: undefined,
          })
          .select()
          .single();

        if (error) throw error;
        console.log("Product duplicated:", newProduct);
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
      <ProductTable
        storefrontId={storefrontId}
        products={products}
        onProductUpdate={refetch}
        onDuplicate={handleDuplicateProducts}
      />
    </div>
  );
};
