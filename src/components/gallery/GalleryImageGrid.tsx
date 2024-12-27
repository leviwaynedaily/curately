import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2 } from "lucide-react";
import { ImageDetailsDialog } from "./ImageDetailsDialog";
import { ImageEditDialog } from "./ImageEditDialog";
import { ImageDeleteDialog } from "./ImageDeleteDialog";
import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";

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
    // Convert selected images to array of id/filePath pairs
    const imagesToDelete = images
      .filter((image) => selectedImages.has(image.id))
      .map((image) => ({
        id: image.id,
        filePath: image.file_path,
      }));

    // Delete each selected image
    imagesToDelete.forEach((image) => {
      onDeleteImage(image);
    });

    // Reset selection
    setSelectedImages(new Set());
    setIsSelectionMode(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => {
            setIsSelectionMode(!isSelectionMode);
            if (!isSelectionMode) {
              setSelectedImages(new Set());
            }
          }}
        >
          {isSelectionMode ? "Cancel Selection" : "Select Images"}
        </Button>
        {isSelectionMode && selectedImages.size > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedImages.size} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBatchDelete}
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer",
              isSelectionMode && "hover:opacity-90"
            )}
            onClick={(e: React.MouseEvent) => {
              if (isSelectionMode) {
                toggleImageSelection(image.id, e);
              } else {
                setSelectedImage(image);
              }
            }}
          >
            <img
              src={`${
                import.meta.env.VITE_SUPABASE_URL
              }/storage/v1/object/public/gallery_images/${image.file_path}`}
              alt={image.title || "Gallery image"}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              {isSelectionMode ? (
                <div className="absolute top-2 right-2">
                  <CheckCircle2
                    className={cn(
                      "h-6 w-6",
                      selectedImages.has(image.id)
                        ? "text-primary"
                        : "text-muted"
                    )}
                  />
                </div>
              ) : (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToEdit(image);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageToDelete({
                        id: image.id,
                        filePath: image.file_path,
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {(image.title || image.description) && !isSelectionMode && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  {image.title && (
                    <h3 className="text-white font-semibold">
                      {image.title}
                    </h3>
                  )}
                  {image.description && (
                    <p className="text-white/80 text-sm line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
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