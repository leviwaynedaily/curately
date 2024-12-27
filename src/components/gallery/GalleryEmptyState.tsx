import { Image as ImageIcon } from "lucide-react";

export const GalleryEmptyState = () => {
  return (
    <div className="text-center py-12">
      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
      <p className="mt-4 text-muted-foreground">No images in this gallery</p>
    </div>
  );
};