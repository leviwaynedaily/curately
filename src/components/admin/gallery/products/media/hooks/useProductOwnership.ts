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
    
    // First check if user is a platform admin
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error checking user role:", profileError);
      throw new Error("Failed to verify user role");
    }

    console.log("User role data:", profileData);

    // If user is a platform admin, they have access to all products
    if (profileData?.role === "platform_admin") {
      console.log("User is platform admin, access granted");
      return true;
    }

    // If not a platform admin, check business ownership
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        storefront_id,
        storefronts!inner (
          id,
          business_id,
          businesses!inner (
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

    console.log("Product ownership data:", data);

    // Check if the authenticated user is the owner of the business
    const isOwner = data.storefronts?.businesses?.owner_id === user.id;
    
    if (!isOwner) {
      console.error("Unauthorized: User does not own this product");
      throw new Error("Unauthorized: You don't have permission to modify this product");
    }

    console.log("Product ownership verified successfully");
    return true;
  };

  return { verifyProductOwnership };
};