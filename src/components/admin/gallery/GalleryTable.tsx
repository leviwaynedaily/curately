import { Table, TableBody } from "@/components/ui/table";
import { GalleryTableHeader } from "./GalleryTableHeader";
import { GalleryTableRow } from "./GalleryTableRow";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type GalleryTableProps = {
  galleries: any[];
  onEdit: (gallery: any) => void;
  onDelete: (gallery: any) => void;
};

export const GalleryTable = ({
  galleries,
  onEdit,
  onDelete,
}: GalleryTableProps) => {
  const [showHiddenFields, setShowHiddenFields] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowHiddenFields(!showHiddenFields)}
        >
          {showHiddenFields ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <Table>
        <GalleryTableHeader showHiddenFields={showHiddenFields} />
        <TableBody>
          {galleries?.map((gallery) => (
            <GalleryTableRow
              key={gallery.id}
              gallery={gallery}
              onEdit={onEdit}
              onDelete={onDelete}
              showHiddenFields={showHiddenFields}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};