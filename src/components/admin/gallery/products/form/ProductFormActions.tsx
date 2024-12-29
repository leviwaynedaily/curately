import { Button } from "@/components/ui/button";

type ProductFormActionsProps = {
  isLoading: boolean;
  uploadingMedia: boolean;
  onClose: () => void;
  isEditMode: boolean;
};

export const ProductFormActions = ({
  isLoading,
  uploadingMedia,
  onClose,
  isEditMode,
}: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button type="button" variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isLoading || uploadingMedia}
      >
        {isLoading || uploadingMedia ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Product")}
      </Button>
    </div>
  );
};