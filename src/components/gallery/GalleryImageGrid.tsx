import { useState } from "react";
import { GalleryImage } from "@/types/gallery";
import { GallerySelectionControls } from "./GallerySelectionControls";
import { GalleryImageItem } from "./GalleryImageItem";
import { useImageSelection } from "@/hooks/useImageSelection";
import { GalleryDialogs } from "./GalleryDialogs";
import { useToast } from "@/components/ui/use-toast";

type GalleryImageGridProps = {
  images: GalleryImage[];
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => void;
  accentColor?: string;
  isAdmin: boolean;
};

export const GalleryImageGrid = ({
  images,
  galleryId,
  onDeleteImage,
  accentColor,
  isAdmin,
}: GalleryImageGridProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageToEdit, setImageToEdit] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    filePath: string;
  } | null>(null);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowStartIndex, setSlideshowStartIndex] = useState(0);
  const { toast } = useToast();

  const {
    selectedImages,
    isSelectionMode,
    setIsSelectionMode,
    toggleImageSelection,
    clearSelection,
  } = useImageSelection();

  const handleBatchDelete = () => {
    const imagesToDelete = images
      .filter((image) => selectedImages.has(image.id))
      .map((image) => ({
        id: image.id,
        filePath: image.file_path,
      }));

    imagesToDelete.forEach((image) => {
      onDeleteImage(image);
    });

    clearSelection();
  };

  const handleStartSlideshow = (index: number) => {
    setSlideshowStartIndex(index);
    setIsSlideshowOpen(true);
  };

  const handleReorderClick = () => {
    toast({
      description: "Image reordering feature coming soon!",
    });
  };

  const handleFilterClick = () => {
    toast({
      description: "Image filtering feature coming soon!",
    });
  };

  return (
    <div className="space-y-8">
      {isAdmin && (
        <GallerySelectionControls
          isSelectionMode={isSelectionMode}
          selectedCount={selectedImages.size}
          onToggleSelectionMode={() => {
            setIsSelectionMode(!isSelectionMode);
            if (!isSelectionMode) {
              clearSelection();
            }
          }}
          onDeleteSelected={handleBatchDelete}
        />
      )}

      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        style={{
          '--hover-color': accentColor || '#8989DE',
        } as React.CSSProperties}
      >
        {images.map((image, index) => (
          <GalleryImageItem
            key={image.id}
            image={image}
            isSelectionMode={isSelectionMode}
            isSelected={selectedImages.has(image.id)}
            onImageClick={(e: React.MouseEvent) => {
              if (isSelectionMode) {
                toggleImageSelection(image.id);
              } else {
                setSelectedImage(image);
              }
            }}
            onEditClick={() => setImageToEdit(image)}
            onDeleteClick={() =>
              setImageToDelete({
                id: image.id,
                filePath: image.file_path,
              })
            }
            onStartSlideshow={() => handleStartSlideshow(index)}
            onReorderClick={handleReorderClick}
            onFilterClick={handleFilterClick}
            isAdmin={isAdmin}
          />
        ))}
      </div>

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
        images={images}
        onDeleteImage={onDeleteImage}
      />
    </div>
  );
};