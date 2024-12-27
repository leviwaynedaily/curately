import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryCard } from "./GalleryCard";
import { Gallery } from "@/types/gallery";

export const GalleryGrid = () => {
  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries"],
    queryFn: async () => {
      console.log("Fetching galleries for grid view...");
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          id,
          name,
          password,
          businesses (
            name
          )
        `)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching galleries:", error);
        throw error;
      }

      console.log("Fetched galleries:", data);
      return data as Gallery[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {galleries?.map((gallery) => (
        <GalleryCard key={gallery.id} gallery={gallery} />
      ))}
    </div>
  );
};