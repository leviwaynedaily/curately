import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryControls } from "./GalleryControls";
import { GalleryImageGrid } from "./GalleryImageGrid";
import { GalleryDialogs } from "./GalleryDialogs";
import { useImageSelection } from "@/hooks/useImageSelection";
import { useGalleryActions } from "@/hooks/useGalleryActions";
import { Gallery } from "@/types/gallery";

type GalleryContentProps = {
  gallery: Gallery;
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => Promise<void>;
  onUploadComplete: () => Promise<void>;
};

export const GalleryContent = ({
  gallery,
  galleryId,
  onDeleteImage,
  onUploadComplete,
}: GalleryContentProps) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);
  const { selectedImages, toggleImageSelection, clearSelection } = useImageSelection();
  const { deleteImages } = useGalleryActions();

  const { data: products } = useQuery({
    queryKey: ["products", galleryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media (*)
        `)
        .eq("storefront_id", galleryId);

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <GalleryHeader name={gallery.name} />
      
      <GalleryControls
        sort="date_desc"
        onSortChange={() => {}}
        status="all"
        onStatusChange={() => {}}
      />

      <GalleryImageGrid
        images={products?.flatMap(p => p.product_media) || []}
        galleryId={galleryId}
        onDeleteImage={onDeleteImage}
        accentColor={gallery.accent_color}
        isAdmin={true}
      />

      <GalleryDialogs
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        imageToEdit={imageToEdit}
        setImageToEdit={setImageToEdit}
        imageToDelete={imageToDelete}
        setImageToDelete={setImageToDelete}
        isSlideshowOpen={isSlideshowOpen}
        setIsSlideshowOpen={setIsSlideshowOpen}
        slideshowStartIndex={slideshowStartIndex}
        galleryId={galleryId}
        images={products?.flatMap(p => p.product_media) || []}
        onDeleteImage={onDeleteImage}
      />
    </div>
  );
};