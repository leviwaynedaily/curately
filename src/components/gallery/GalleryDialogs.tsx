import { StorefrontImage } from "@/types/storefront";
import { ImageDetailsDialog } from "./ImageDetailsDialog";
import { ImageEditDialog } from "./ImageEditDialog";
import { ImageDeleteDialog } from "./ImageDeleteDialog";
import { GallerySlideshowDialog } from "./GallerySlideshowDialog";

type GalleryDialogsProps = {
  selectedImage: StorefrontImage | null;
  setSelectedImage: (image: StorefrontImage | null) => void;
  imageToEdit: StorefrontImage | null;
  setImageToEdit: (image: StorefrontImage | null) => void;
  imageToDelete: { id: string; filePath: string } | null;
  setImageToDelete: (image: { id: string; filePath: string } | null) => void;
  isSlideshowOpen: boolean;
  setIsSlideshowOpen: (isOpen: boolean) => void;
  slideshowStartIndex: number;
  galleryId: string;
  images: StorefrontImage[];
  onDeleteImage: (image: { id: string; filePath: string }) => void;
};

export const GalleryDialogs = ({
  selectedImage,
  setSelectedImage,
  imageToEdit,
  setImageToEdit,
  imageToDelete,
  setImageToDelete,
  isSlideshowOpen,
  setIsSlideshowOpen,
  slideshowStartIndex,
  galleryId,
  images,
  onDeleteImage,
}: GalleryDialogsProps) => {
  return (
    <>
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

      <GallerySlideshowDialog
        isOpen={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
        images={images}
        startIndex={slideshowStartIndex}
      />
    </>
  );
};