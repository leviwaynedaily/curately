import { Button } from "@/components/ui/button";
import { StorefrontImage } from "@/types/storefront";

type GalleryImageActionsProps = {
  image: StorefrontImage;
  onEdit: () => void;
  onDelete: () => void;
};

export const GalleryImageActions = ({ image, onEdit, onDelete }: GalleryImageActionsProps) => {
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <Button variant="secondary" size="icon" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="destructive" size="icon" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};
