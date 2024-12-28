import { StorefrontImage } from "@/types/storefront";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type GalleryImageDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  image: StorefrontImage;
};

export const GalleryImageDetails = ({ isOpen, onClose, image }: GalleryImageDetailsProps) => {
  const { toast } = useToast();

  const handleImageClick = () => {
    toast({
      description: `Image Title: ${image.title || "No Title"}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{image.title || "Image Details"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${image.file_path}`}
            alt={image.title || "Gallery Image"}
            className="w-full h-auto rounded-lg"
            onClick={handleImageClick}
          />
          <p>{image.description || "No description available."}</p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
