import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { GalleryImageGrid } from "./GalleryImageGrid";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryControls } from "./GalleryControls";
import { GalleryDialogs } from "./GalleryDialogs";
import { useImageSelection } from "@/hooks/useImageSelection";
import { useGalleryActions } from "@/hooks/useGalleryActions";

export const GalleryContent = () => {
  const { id } = useParams();
  const { selectedImages, toggleImageSelection, clearSelection } = useImageSelection();
  const { deleteImages } = useGalleryActions();

  const { data: storefront, isLoading: isStorefrontLoading } = useQuery({
    queryKey: ["storefronts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          *,
          businesses (
            owner_id
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media (*)
        `)
        .eq("storefront_id", id);

      if (error) throw error;
      return data;
    },
  });

  if (isStorefrontLoading || isProductsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <GalleryHeader storefront={storefront} />
      
      <GalleryControls
        selectedCount={selectedImages.length}
        onClearSelection={clearSelection}
        onDelete={() => deleteImages(selectedImages)}
      />

      <GalleryImageGrid
        products={products || []}
        selectedImages={selectedImages}
        onImageSelect={toggleImageSelection}
      />

      <GalleryDialogs />
    </div>
  );
};