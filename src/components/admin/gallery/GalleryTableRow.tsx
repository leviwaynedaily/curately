import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

type GalleryTableRowProps = {
  gallery: {
    id: string;
    name: string;
    status: string;
    created_at: string;
    businesses?: {
      name: string;
    };
  };
  onEdit: (gallery: any) => void;
  onDelete: (gallery: any) => void;
  showHiddenFields?: boolean;
};

export const GalleryTableRow = ({
  gallery,
  onEdit,
  onDelete,
  showHiddenFields,
}: GalleryTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{gallery.name}</TableCell>
      <TableCell>{gallery.status}</TableCell>
      {showHiddenFields && (
        <>
          <TableCell>{gallery.businesses?.name || "N/A"}</TableCell>
          <TableCell>
            <code className="px-2 py-1 bg-muted rounded text-xs">{gallery.id}</code>
          </TableCell>
        </>
      )}
      <TableCell>{new Date(gallery.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(gallery)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(gallery)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};