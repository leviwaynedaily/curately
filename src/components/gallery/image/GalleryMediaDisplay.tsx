import { GalleryImage } from "@/types/gallery";

type GalleryMediaDisplayProps = {
  image: GalleryImage;
  mediaUrl: string;
};

export const GalleryMediaDisplay = ({ image, mediaUrl }: GalleryMediaDisplayProps) => {
  if (image.media_type === 'video') {
    return (
      <video 
        src={mediaUrl}
        className="w-full h-full object-cover"
        controls
      />
    );
  }
  
  return (
    <img
      src={mediaUrl}
      alt={image.title || "Gallery media"}
      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
    />
  );
};