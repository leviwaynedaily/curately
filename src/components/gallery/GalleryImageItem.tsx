import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";
import { GalleryMediaDisplay } from "./image/GalleryMediaDisplay";
import { GalleryImageOverlay } from "./image/GalleryImageOverlay";
import { GalleryImageDetails } from "./image/GalleryImageDetails";

type GalleryImageItemProps = {
  image: GalleryImage;
  isSelectionMode: boolean;
  isSelected: boolean;
  onImageClick: (e: React.MouseEvent) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onStartSlideshow: () => void;
  onReorderClick: () => void;
  onFilterClick: () => void;
  isAdmin: boolean;
};

export const GalleryImageItem = ({
  image,
  isSelectionMode,
  isSelected,
  onImageClick,
  onEditClick,
  onDeleteClick,
  onStartSlideshow,
  onReorderClick,
  onFilterClick,
  isAdmin,
}: GalleryImageItemProps) => {
  const mediaUrl = `${
    import.meta.env.VITE_SUPABASE_URL
  }/storage/v1/object/public/gallery_images/${image.file_path}`;

  return (
    <div
      className={cn(
        "group relative aspect-square rounded-xl overflow-hidden cursor-pointer",
        "shadow-md hover:shadow-xl transition-all duration-300",
        "bg-gradient-to-br from-gray-50 to-gray-100",
        isSelectionMode && "hover:opacity-90"
      )}
      onClick={onImageClick}
      style={{
        '--tw-ring-color': 'var(--hover-color)',
      } as React.CSSProperties}
    >
      <GalleryMediaDisplay image={image} mediaUrl={mediaUrl} />
      
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {isAdmin && (
          <GalleryImageOverlay
            isSelectionMode={isSelectionMode}
            isSelected={isSelected}
            onEditClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            onDeleteClick={(e) => {
              e.stopPropagation();
              onDeleteClick();
            }}
          />
        )}
        
        {!isSelectionMode && (
          <GalleryImageDetails
            image={image}
            onStartSlideshow={onStartSlideshow}
            onReorderClick={onReorderClick}
            onFilterClick={onFilterClick}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
};