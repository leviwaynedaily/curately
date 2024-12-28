import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/admin/gallery/products/types";

export const useStorefrontProducts = (storefrontId: string | undefined, isVerified: boolean) => {
  return useQuery({
    queryKey: ["storefront-products", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront view:", storefrontId);
      
      if (!storefrontId) {
        throw new Error("No storefront ID provided");
      }

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
        .eq("status", "active");

      if (error) {
        console.error("Error fetching storefront products:", error);
        throw error;
      }

      console.log("Storefront products fetched:", data);
      
      return data.map((product: any) => ({
        ...product,
        primary_media: product.product_media?.find((media: any) => media.is_primary)?.file_path
      }));
    },
    enabled: !!storefrontId && isVerified,
  });
};