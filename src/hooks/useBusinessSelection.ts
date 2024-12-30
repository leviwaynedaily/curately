import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinessSelection = () => {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // First, check if user is platform admin
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      console.log("Fetching user profile");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return null;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("User profile:", profile);
      return profile;
    }
  });

  // Fetch all businesses if platform admin, otherwise just user's business
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["businesses", userProfile?.role],
    queryFn: async () => {
      if (!userProfile) return null;

      console.log("Fetching businesses for role:", userProfile.role);
      let query = supabase.from("businesses").select("*");
      
      if (userProfile.role !== "platform_admin") {
        query = query.eq("owner_id", userProfile.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching businesses:", error);
        return null;
      }

      console.log("Fetched businesses:", data);
      return data;
    },
    enabled: !!userProfile
  });

  return {
    userProfile,
    businesses,
    isLoadingBusinesses,
    selectedBusinessId,
    setSelectedBusinessId,
    isPlatformAdmin: userProfile?.role === "platform_admin"
  };
};