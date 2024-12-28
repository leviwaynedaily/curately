import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ProductMediaCarouselProps = {
  media: Array<{
    id: string;
    file_path: string;
    media_type?: string;
  }>;
  allowDownload?: boolean;
  onDownload?: (mediaPath: string) => void;
};

export const ProductMediaCarousel = ({ 
  media,
  allowDownload = false,
  onDownload
}: ProductMediaCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  };

  if (!media.length) return null;

  const currentMedia = media[currentIndex];
  const mediaUrl = supabase.storage
    .from("gallery_images")
    .getPublicUrl(currentMedia.file_path).data.publicUrl;

  return (
    <div className="relative w-full h-full group">
      {currentMedia.media_type === "video" ? (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          controls
        />
      ) : (
        <img
          src={mediaUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      )}

      {media.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={handlePrevious}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
            onClick={handleNext}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {allowDownload && onDownload && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white"
          onClick={() => onDownload(currentMedia.file_path)}
        >
          <Download className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};