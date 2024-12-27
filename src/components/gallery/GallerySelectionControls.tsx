import { Button } from "@/components/ui/button";

type GallerySelectionControlsProps = {
  isSelectionMode: boolean;
  selectedCount: number;
  onToggleSelectionMode: () => void;
  onDeleteSelected: () => void;
};

export const GallerySelectionControls = ({
  isSelectionMode,
  selectedCount,
  onToggleSelectionMode,
  onDeleteSelected,
}: GallerySelectionControlsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onToggleSelectionMode}
      >
        {isSelectionMode ? "Cancel Selection" : "Select Images"}
      </Button>
      {isSelectionMode && selectedCount > 0 && (
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground">
            {selectedCount} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
          >
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};