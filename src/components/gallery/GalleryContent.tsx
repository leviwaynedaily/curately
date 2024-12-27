import { Gallery } from "@/types/gallery";
import { GalleryHeader } from "./GalleryHeader";
import { ImageUpload } from "./ImageUpload";
import { GalleryImageGrid } from "./GalleryImageGrid";
import { GalleryEmptyState } from "./GalleryEmptyState";

type GalleryContentProps = {
  gallery: Gallery;
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => void;
  onUploadComplete: () => void;
};

export const GalleryContent = ({
  gallery,
  galleryId,
  onDeleteImage,
  onUploadComplete,
}: GalleryContentProps) => {
  return (
    <div className="max-w-7xl mx-auto">
      <GalleryHeader name={gallery.name} />
      <ImageUpload
        galleryId={galleryId}
        onUploadComplete={onUploadComplete}
      />
      {gallery.gallery_images?.length ? (
        <GalleryImageGrid
          images={gallery.gallery_images}
          galleryId={galleryId}
          onDeleteImage={onDeleteImage}
        />
      ) : (
        <GalleryEmptyState />
      )}
    </div>
  );
};