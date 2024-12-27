import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBusinesses = (searchQuery: string) => {
  return useQuery({
    queryKey: ["businesses", searchQuery],
    queryFn: async () => {
      console.log("Fetching businesses...");
      let query = supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
      }

      console.log("Businesses fetched:", data);
      return data;
    },
  });
};