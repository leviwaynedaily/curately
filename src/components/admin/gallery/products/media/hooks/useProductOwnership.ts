import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const useProductOwnership = () => {
  const { user } = useAuth();

  const verifyProductOwnership = async (productId: string) => {
    if (!user) {
      console.error("No authenticated user found");
      throw new Error("No authenticated user found");
    }

    console.log("Verifying product ownership for:", productId);
    
    // First get the product and its relationships
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        storefronts (
          id,
          businesses (
            id,
            owner_id
          )
        )
      `)
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error verifying product ownership:", error);
      throw new Error("Failed to verify product ownership");
    }

    if (!data) {
      console.error("Product not found");
      throw new Error("Product not found");
    }

    // Check if the authenticated user is the owner of the business
    const storefront = data.storefronts;
    if (!storefront || !storefront.businesses) {
      console.error("Invalid product data structure");
      throw new Error("Invalid product data structure");
    }

    const isOwner = storefront.businesses.owner_id === user.id;
    
    if (!isOwner) {
      console.error("Unauthorized: User does not own this product");
      throw new Error("Unauthorized: You don't have permission to modify this product");
    }

    console.log("Product ownership verified successfully");
    return true;
  };

  return { verifyProductOwnership };
};