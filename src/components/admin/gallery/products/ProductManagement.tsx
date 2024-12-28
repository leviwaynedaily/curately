import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductTable } from "./ProductTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ProductManagementProps = {
  storefrontId: string;
};

export const ProductManagement = ({ storefrontId }: ProductManagementProps) => {
  const { toast } = useToast();

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", storefrontId],
    queryFn: async () => {
      console.log("Starting product fetch for storefront:", storefrontId);
      
      // First, verify the storefront exists
      const { data: storefront, error: storefrontError } = await supabase
        .from("storefronts")
        .select("id")
        .eq("id", storefrontId)
        .maybeSingle();

      if (storefrontError) {
        console.error("Error verifying storefront:", storefrontError);
        throw storefrontError;
      }

      console.log("Storefront verified:", storefront);

      // Now fetch products
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products query result:", data);
      return data;
    },
  });

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Error loading products. Please try again.
      </div>
    );
  }

  const handleAddProduct = async () => {
    try {
      console.log("Adding new product for storefront:", storefrontId);
      const { data, error } = await supabase.from("products").insert({
        storefront_id: storefrontId,
        name: "New Product",
        status: "active",
      });

      if (error) {
        console.error("Error adding product:", error);
        throw error;
      }

      console.log("Product added successfully:", data);
      toast({ description: "Product added successfully" });
      refetch();
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
      toast({
        variant: "destructive",
        description: "Failed to add product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Products</h2>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {!products || products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button onClick={handleAddProduct} variant="outline" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <ProductTable
          storefrontId={storefrontId}
          products={products}
          onProductUpdate={refetch}
        />
      )}
    </div>
  );
};