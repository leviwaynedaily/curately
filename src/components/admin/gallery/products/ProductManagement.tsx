import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductTable } from "./ProductTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ProductManagementProps = {
  galleryId: string;
};

export const ProductManagement = ({ galleryId }: ProductManagementProps) => {
  const { toast } = useToast();

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["products", galleryId],
    queryFn: async () => {
      console.log("Fetching products for gallery:", galleryId);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("gallery_id", galleryId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Fetched products:", data);
      return data;
    },
  });

  const handleAddProduct = async () => {
    try {
      const { error } = await supabase.from("products").insert({
        gallery_id: galleryId,
        name: "New Product",
        status: "active",
      });

      if (error) throw error;

      toast({ description: "Product added successfully" });
      refetch();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        description: "Failed to add product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

      <ProductTable
        galleryId={galleryId}
        products={products || []}
        onProductUpdate={refetch}
      />
    </div>
  );
};