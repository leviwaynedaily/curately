import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ImageDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  image: {
    title?: string;
    description?: string;
    file_path: string;
  };
};

export const ImageDetailsDialog = ({
  isOpen,
  onClose,
  image,
}: ImageDetailsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="mt-4">
          <img
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${image.file_path}`}
            alt={image.title || "Gallery image"}
            className="w-full rounded-lg"
          />
          {(image.title || image.description) && (
            <div className="mt-4 space-y-2">
              {image.title && (
                <h3 className="text-lg font-semibold">{image.title}</h3>
              )}
              {image.description && (
                <p className="text-muted-foreground">{image.description}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};