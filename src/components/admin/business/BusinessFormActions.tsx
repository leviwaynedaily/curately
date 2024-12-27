import { Button } from "@/components/ui/button";

type BusinessFormActionsProps = {
  isLoading: boolean;
  onCancel: () => void;
};

export const BusinessFormActions = ({
  isLoading,
  onCancel,
}: BusinessFormActionsProps) => {
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