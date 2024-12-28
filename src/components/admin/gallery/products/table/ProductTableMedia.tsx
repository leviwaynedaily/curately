import { TableCell } from "@/components/ui/table";
import { ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

type ProductTableMediaProps = {
  productId: string;
};

export const ProductTableMedia = ({ productId }: ProductTableMediaProps) => {
  const [primaryMedia, setPrimaryMedia] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  useEffect(() => {
    const fetchPrimaryMedia = async () => {
      setIsLoadingMedia(true);
      try {
        console.log("Fetching primary media for product:", productId);
        const { data, error } = await supabase
          .from("product_media")
          .select("file_path")
          .eq("product_id", productId)
          .eq("is_primary", true)
          .maybeSingle();

        if (error) {
          console.error("Error fetching primary media:", error);
          return;
        }

        if (data) {
          setPrimaryMedia(data.file_path);
        }
      } catch (error) {
        console.error("Error in fetchPrimaryMedia:", error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchPrimaryMedia();
  }, [productId]);

  return (
    <div className="w-10 h-10">
      {isLoadingMedia ? (
        <div className="w-10 h-10 bg-muted animate-pulse rounded" />
      ) : primaryMedia ? (
        <img
          src={supabase.storage.from("gallery_images").getPublicUrl(primaryMedia).data.publicUrl}
          alt=""
          className="w-10 h-10 object-cover rounded"
        />
      ) : (
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};