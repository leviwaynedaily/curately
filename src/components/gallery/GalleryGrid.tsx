import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryCard } from "./GalleryCard";
import { GalleryControls } from "./GalleryControls";
import { Gallery } from "@/types/gallery";

type SortOption = "name_asc" | "name_desc" | "date_asc" | "date_desc";
type StatusFilter = "all" | "active" | "archived";

export const GalleryGrid = () => {
  const [sort, setSort] = useState<SortOption>("date_desc");
  const [status, setStatus] = useState<StatusFilter>("active");

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries", sort, status],
    queryFn: async () => {
      console.log("Fetching galleries for grid view...");
      console.log("Sort:", sort, "Status:", status);

      let query = supabase
        .from("galleries")
        .select(`
          id,
          name,
          password,
          created_at,
          status,
          businesses (
            name
          )
        `);

      // Apply status filter
      if (status !== "all") {
        query = query.eq("status", status);
      }

      // Apply sorting
      switch (sort) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "date_asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "date_desc":
          query = query.order("created_at", { ascending: false });
          break;
      }

      const { data, error } = await query;

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
      <div className="space-y-6">
        <GalleryControls
          sort={sort}
          onSortChange={setSort}
          status={status}
          onStatusChange={setStatus}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GalleryControls
        sort={sort}
        onSortChange={setSort}
        status={status}
        onStatusChange={setStatus}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleries?.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </div>
  );
};