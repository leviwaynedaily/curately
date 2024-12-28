import { StorefrontImage } from "@/types/storefront";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type GalleryImageDetailsProps = {
  image: StorefrontImage;
  onStartSlideshow?: () => void;
  onReorderClick?: () => void;
  onFilterClick?: () => void;
  isAdmin?: boolean;
};

export const GalleryImageDetails = ({ 
  image, 
  onStartSlideshow,
  onReorderClick,
  onFilterClick,
  isAdmin 
}: GalleryImageDetailsProps) => {
  const { toast } = useToast();

  const handleImageClick = () => {
    toast({
      description: `Image Title: ${image.title || "No Title"}`,
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
      <div>
        <h3 className="text-lg font-semibold">{image.title || "Untitled"}</h3>
        {image.description && (
          <p className="text-sm opacity-90">{image.description}</p>
        )}
      </div>
      
      {isAdmin && (
        <div className="flex gap-2 mt-4">
          {onStartSlideshow && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStartSlideshow();
              }}
            >
              Start Slideshow
            </Button>
          )}
          {onReorderClick && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onReorderClick();
              }}
            >
              Reorder
            </Button>
          )}
          {onFilterClick && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFilterClick();
              }}
            >
              Filter
            </Button>
          )}
        </div>
      )}
    </div>
  );
};