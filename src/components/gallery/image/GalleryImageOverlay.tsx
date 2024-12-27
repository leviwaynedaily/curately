import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type GalleryImageOverlayProps = {
  isSelectionMode: boolean;
  isSelected: boolean;
  onEditClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
};

export const GalleryImageOverlay = ({
  isSelectionMode,
  isSelected,
  onEditClick,
  onDeleteClick,
}: GalleryImageOverlayProps) => {
  if (isSelectionMode) {
    return (
      <div className="absolute top-2 right-2">
        <div className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted"}`} />
      </div>
    );
  }

  return (
    <div className="absolute top-2 right-2 flex gap-2">
      <Button
        variant="secondary"
        size="icon"
        onClick={onEditClick}
        className="backdrop-blur-md bg-white/20 hover:bg-white/30"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDeleteClick}
        className="backdrop-blur-md bg-white/20 hover:bg-white/30"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};