import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "../types";
import { cn } from "@/lib/utils";

type ProductTableCellProps = {
  field: keyof Product;
  value: any;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: any) => void;
  className?: string;
};

export const ProductTableCell = ({
  field,
  value,
  isEditing,
  onEdit,
  onChange,
  className,
}: ProductTableCellProps) => {
  const handleDoubleClick = () => {
    if (!isEditing) {
      onEdit();
    }
  };

  if (isEditing) {
    if (field === "description") {
      return (
        <TableCell className={cn("min-w-[300px]", className)}>
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[60px]"
          />
        </TableCell>
      );
    }

    if (field === "price" || field === "stock_quantity") {
      return (
        <TableCell className={className}>
          <Input
            type="number"
            value={value || ""}
            onChange={(e) => onChange(field === "price" ? parseFloat(e.target.value) : parseInt(e.target.value))}
            className="w-full"
          />
        </TableCell>
      );
    }

    if (field === "status") {
      return (
        <TableCell className={className}>
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      );
    }

    return (
      <TableCell className={className}>
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      </TableCell>
    );
  }

  return (
    <TableCell 
      onDoubleClick={handleDoubleClick} 
      className={cn("cursor-pointer", className)}
    >
      {field === "status" ? (
        <span className={`capitalize ${value === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
          {value}
        </span>
      ) : (
        value
      )}
    </TableCell>
  );
};