import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorefrontImage } from "@/types/storefront";

type GallerySlideshowDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  images: StorefrontImage[];
  startIndex: number;
};

export const GallerySlideshowDialog = ({
  isOpen,
  onClose,
  images,
  startIndex,
}: GallerySlideshowDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Slideshow</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          {images.length > 0 ? (
            <img
              src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${images[startIndex].file_path}`}
              alt={images[startIndex].title || "Slideshow image"}
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : (
            <p>No images available for slideshow.</p>
          )}
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
