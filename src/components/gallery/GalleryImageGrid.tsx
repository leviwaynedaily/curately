import { useState } from "react";
import { ImageDetailsDialog } from "./ImageDetailsDialog";
import { ImageEditDialog } from "./ImageEditDialog";
import { ImageDeleteDialog } from "./ImageDeleteDialog";
import { GalleryImage } from "@/types/gallery";
import { GallerySelectionControls } from "./GallerySelectionControls";
import { GalleryImageItem } from "./GalleryImageItem";

type GalleryImageGridProps = {
  images: GalleryImage[];
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => void;
};

export const GalleryImageGrid = ({
  images,
  galleryId,
  onDeleteImage,
}: GalleryImageGridProps) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageToEdit, setImageToEdit] = useState<GalleryImage | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{
    id: string;
    filePath: string;
  } | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleImageSelection = (imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newSelection = new Set(selectedImages);
    if (newSelection.has(imageId)) {
      newSelection.delete(imageId);
    } else {
      newSelection.add(imageId);
    }
    setSelectedImages(newSelection);
  };

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

    setSelectedImages(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div className="space-y-4">
      <GallerySelectionControls
        isSelectionMode={isSelectionMode}
        selectedCount={selectedImages.size}
        onToggleSelectionMode={() => {
          setIsSelectionMode(!isSelectionMode);
          if (!isSelectionMode) {
            setSelectedImages(new Set());
          }
        }}
        onDeleteSelected={handleBatchDelete}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <GalleryImageItem
            key={image.id}
            image={image}
            isSelectionMode={isSelectionMode}
            isSelected={selectedImages.has(image.id)}
            onImageClick={(e: React.MouseEvent) => {
              if (isSelectionMode) {
                toggleImageSelection(image.id, e);
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
          />
        ))}
      </div>

      {selectedImage && (
        <ImageDetailsDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
        />
      )}

      {imageToEdit && (
        <ImageEditDialog
          isOpen={!!imageToEdit}
          onClose={() => setImageToEdit(null)}
          image={imageToEdit}
          galleryId={galleryId}
        />
      )}

      <ImageDeleteDialog
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => {
          if (imageToDelete) {
            onDeleteImage(imageToDelete);
            setImageToDelete(null);
          }
        }}
      />
    </div>
  );
};