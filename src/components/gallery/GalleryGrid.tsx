import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { GalleryCard } from "./GalleryCard";
import { useSearch } from "@/hooks/useSearch";

export const GalleryGrid = () => {
  const { searchQuery } = useSearch();

  const { data: storefronts, isLoading } = useQuery({
    queryKey: ["storefronts", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("storefronts")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted animate-pulse rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {storefronts?.map((storefront) => (
        <Link key={storefront.id} to={`/storefront/${storefront.id}`}>
          <GalleryCard storefront={storefront} />
        </Link>
      ))}
    </div>
  );
};