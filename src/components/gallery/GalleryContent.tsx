import { Gallery } from "@/types/gallery";
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
  // Create dynamic styles based on gallery settings
  const headerStyle = {
    backgroundColor: gallery.primary_color || '#141413',
    color: gallery.secondary_color || '#E6E4DD',
  };

  const containerStyle = {
    backgroundColor: gallery.secondary_color || '#E6E4DD',
    color: gallery.primary_color || '#141413',
  };

  return (
    <div style={containerStyle} className="min-h-screen">
      <div 
        style={headerStyle}
        className="py-8 px-4 mb-8 shadow-lg"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{gallery.name}</h1>
          {gallery.description && (
            <p className="text-lg opacity-90">{gallery.description}</p>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        <ImageUpload
          galleryId={galleryId}
          onUploadComplete={onUploadComplete}
        />
        {gallery.gallery_images?.length ? (
          <GalleryImageGrid
            images={gallery.gallery_images}
            galleryId={galleryId}
            onDeleteImage={onDeleteImage}
            accentColor={gallery.accent_color}
          />
        ) : (
          <GalleryEmptyState />
        )}
      </div>
    </div>
  );
};