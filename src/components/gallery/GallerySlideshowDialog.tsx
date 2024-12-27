import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { GalleryImage } from "@/types/gallery";

type GallerySlideshowDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  startIndex?: number;
};

export const GallerySlideshowDialog = ({
  isOpen,
  onClose,
  images,
  startIndex = 0,
}: GallerySlideshowDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const currentImage = images[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsPlaying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{currentImage?.title || "Slideshow"}</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video">
          <img
            src={`${
              import.meta.env.VITE_SUPABASE_URL
            }/storage/v1/object/public/gallery_images/${currentImage?.file_path}`}
            alt={currentImage?.title || "Gallery image"}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {currentImage?.description && (
          <p className="text-sm text-muted-foreground">{currentImage.description}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};