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
  if (selectedCount === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MoreHorizontal className="h-4 w-4" />
          Selected ({selectedCount})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          onClick={onDuplicate}
          disabled={isDuplicating}
          className="flex items-center"
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
          className="text-destructive flex items-center"
          onClick={onDelete}
          disabled={isDeleting}
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