import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/admin/gallery/products/types";

export const useProducts = (storefrontId: string) => {
  console.log("Initializing useProducts hook with storefrontId:", storefrontId);
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["products", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media (
            id,
            file_path,
            is_primary
          )
        `)
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products fetched successfully:", data);
      return data as Product[];
    },
  });

  return {
    products: products || [],
    isLoading,
    error,
    refetch,
  };
};