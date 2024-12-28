import { StorefrontImage } from "@/types/storefront";

type GalleryMediaDisplayProps = {
  image: StorefrontImage;
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