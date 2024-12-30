import { TableCell } from "@/components/ui/table";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

type ProductTableMediaProps = {
  productId: string;
};

export const ProductTableMedia = ({ productId }: ProductTableMediaProps) => {
  const { data: primaryMedia, isLoading, error } = useQuery({
    queryKey: ["product-media", productId],
    queryFn: async () => {
      console.log("Fetching primary media for product:", productId);
      try {
        const { data, error } = await supabase
          .from("product_media")
          .select("file_path, media_type")
          .eq("product_id", productId)
          .eq("is_primary", true)
          .maybeSingle();

        if (error) {
          console.error("Error fetching primary media:", error);
          throw error;
        }

        console.log("Primary media fetch result:", data);
        return data?.file_path || null;
      } catch (error) {
        console.error("Failed to fetch primary media:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
  });

  if (error) {
    console.error("Error in ProductTableMedia:", error);
    return (
      <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
        <ImageIcon className="w-4 h-4 text-red-500" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10">
      {isLoading ? (
        <div className="w-10 h-10 bg-muted animate-pulse rounded" />
      ) : primaryMedia ? (
        <img
          src={supabase.storage.from("gallery_images").getPublicUrl(primaryMedia).data.publicUrl}
          alt=""
          className="w-10 h-10 object-cover rounded"
          onError={(e) => {
            console.error("Failed to load image:", primaryMedia);
            e.currentTarget.src = ""; // Clear the broken image
            e.currentTarget.className = "hidden";
            e.currentTarget.parentElement?.classList.add("bg-muted");
          }}
        />
      ) : (
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};