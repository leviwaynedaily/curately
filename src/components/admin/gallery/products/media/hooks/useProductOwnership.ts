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
    
    // Exactly match the RLS policy structure with the same table aliases
    const { data, error } = await supabase
      .from("products as p")
      .select(`
        id,
        storefront:storefronts!inner (
          id,
          business:businesses!inner (
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
    const isOwner = data.storefront.business.owner_id === user.id;
    
    if (!isOwner) {
      console.error("Unauthorized: User does not own this product");
      throw new Error("Unauthorized: You don't have permission to modify this product");
    }

    console.log("Product ownership verified successfully");
    return true;
  };

  return { verifyProductOwnership };
};