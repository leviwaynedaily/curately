import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";

type BulkActionMenuProps = {
  selectedCount: number;
  isDeleting: boolean;
  isDuplicating: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
};

export const BulkActionMenu = ({
  selectedCount,
  isDeleting,
  isDuplicating,
  onDelete,
  onDuplicate,
}: BulkActionMenuProps) => {
  console.log("BulkActionMenu render:", { selectedCount, isDeleting, isDuplicating });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="gap-2">
          <MoreHorizontal className="h-4 w-4" />
          {selectedCount} selected
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem 
          onClick={onDuplicate}
          disabled={isDuplicating || selectedCount === 0}
          className="flex items-center cursor-pointer"
        >
          {isDuplicating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Duplicating...
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate ({selectedCount})
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-destructive flex items-center cursor-pointer"
          onClick={onDelete}
          disabled={isDeleting || selectedCount === 0}
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash className="h-4 w-4 mr-2" />
              Delete ({selectedCount})
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};