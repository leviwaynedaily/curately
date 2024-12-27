import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

type BusinessTableRowProps = {
  business: {
    id: string;
    name: string;
    status: string;
    created_at: string;
  };
  onEdit: (business: any) => void;
  onDelete: (business: any) => void;
};

export const BusinessTableRow = ({
  business,
  onEdit,
  onDelete,
}: BusinessTableRowProps) => {
  return (
    <TableRow key={business.id}>
      <TableCell>{business.name}</TableCell>
      <TableCell>{business.status}</TableCell>
      <TableCell>
        {new Date(business.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(business)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(business)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};