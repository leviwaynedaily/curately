import { Button } from "@/components/ui/button";
import { Edit, Trash2, CheckCircle2 } from "lucide-react";
import { GalleryImage } from "@/types/gallery";
import { cn } from "@/lib/utils";
import { GalleryImageActions } from "./GalleryImageActions";

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
}: GalleryImageItemProps) => {
  return (
    <div
      className={cn(
        "group relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer",
        isSelectionMode && "hover:opacity-90"
      )}
      onClick={onImageClick}
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
                isSelected ? "text-primary" : "text-muted"
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
                onEditClick();
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!isSelectionMode && (
          <>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {(image.title || image.description) && (
                <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
                  {image.title && (
                    <h3 className="text-white font-semibold">{image.title}</h3>
                  )}
                  {image.description && (
                    <p className="text-white/80 text-sm line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              )}
              <div className="mt-2">
                <GalleryImageActions
                  image={image}
                  onStartSlideshow={onStartSlideshow}
                  onReorderClick={onReorderClick}
                  onFilterClick={onFilterClick}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};