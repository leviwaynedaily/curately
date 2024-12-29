import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/admin/gallery/products/types";

export const useProducts = (storefrontId: string) => {
  console.log("Initializing useProducts hook with storefrontId:", storefrontId);
  
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ["products", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId);
      
      // First fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("storefront_id", storefrontId)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error("Error fetching products:", productsError);
        throw productsError;
      }

      if (!productsData?.length) {
        console.log("No products found for storefront:", storefrontId);
        return [];
      }

      // Then fetch media for all products in a single query
      const productIds = productsData.map(p => p.id);
      const { data: mediaData, error: mediaError } = await supabase
        .from("product_media")
        .select("*")
        .in("product_id", productIds);

      if (mediaError) {
        console.error("Error fetching product media:", mediaError);
        throw mediaError;
      }

      // Combine products with their media
      const productsWithMedia = productsData.map(product => ({
        ...product,
        product_media: mediaData?.filter(media => media.product_id === product.id) || []
      }));

      console.log("Products fetched successfully:", productsWithMedia);
      return productsWithMedia as Product[];
    },
  });

  return {
    products: products || [],
    isLoading,
    error,
    refetch,
  };
};