import { GalleryImage } from "@/types/gallery";
import { GalleryImageActions } from "../GalleryImageActions";

type GalleryImageDetailsProps = {
  image: GalleryImage;
  onStartSlideshow: () => void;
  onReorderClick: () => void;
  onFilterClick: () => void;
};

export const GalleryImageDetails = ({
  image,
  onStartSlideshow,
  onReorderClick,
  onFilterClick,
}: GalleryImageDetailsProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <div className="bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 rounded-lg backdrop-blur-sm">
        {image.title && (
          <h3 className="text-white font-semibold">{image.title}</h3>
        )}
        {image.description && (
          <p className="text-white/80 text-sm line-clamp-2">
            {image.description}
          </p>
        )}
        {image.price && (
          <p className="text-white font-semibold mt-2">
            ${image.price.toFixed(2)}
          </p>
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
    </div>
  );
};