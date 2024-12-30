import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

type BulkActionButtonProps = {
  selectedCount: number;
};

export const BulkActionButton = ({ selectedCount }: BulkActionButtonProps) => {
  return (
    <Button variant="outline" size="sm">
      <MoreHorizontal className="h-4 w-4 mr-2" />
      Actions ({selectedCount})
    </Button>
  );
};