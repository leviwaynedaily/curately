import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/admin/gallery/products/types";

export const useStorefrontProducts = (storefrontId: string | undefined, isVerified: boolean) => {
  return useQuery({
    queryKey: ["storefront-products", storefrontId],
    queryFn: async () => {
      console.log("Starting product fetch with params:", { storefrontId, isVerified });
      
      if (!storefrontId) {
        console.error("No storefront ID provided");
        throw new Error("No storefront ID provided");
      }

      // First verify the storefront exists
      const { data: storefront, error: storefrontError } = await supabase
        .from("storefronts")
        .select("id")
        .eq("id", storefrontId)
        .maybeSingle();

      if (storefrontError) {
        console.error("Error verifying storefront:", storefrontError);
        throw storefrontError;
      }

      if (!storefront) {
        console.error("Storefront not found:", storefrontId);
        throw new Error("Storefront not found");
      }

      console.log("Storefront verified, fetching products");

      // First, let's check how many products exist without the media join
      const { count, error: countError } = await supabase
        .from("products")
        .select("*", { count: 'exact', head: true })
        .eq("storefront_id", storefrontId);

      console.log("Products count check:", { count, error: countError });

      // Now fetch products with their media (optional join)
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
        .eq("storefront_id", storefrontId);

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Raw products query result:", data);

      // Process the results to include primary media
      const productsWithMedia = data.map((product: any) => ({
        ...product,
        primary_media: product.product_media?.find((media: any) => media.is_primary)?.file_path
      }));

      console.log("Processed products with media:", productsWithMedia);
      return productsWithMedia;
    },
    enabled: !!storefrontId && isVerified,
  });
};