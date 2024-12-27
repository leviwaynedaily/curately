import { Button } from "@/components/ui/button";

type GalleryFormActionsProps = {
  isLoading: boolean;
  onCancel: () => void;
};

export const GalleryFormActions = ({ isLoading, onCancel }: GalleryFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" type="button" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};