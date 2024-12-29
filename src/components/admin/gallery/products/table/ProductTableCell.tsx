import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "../types";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

type ProductTableCellProps = {
  field: keyof Product;
  value: any;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (value: any) => void;
  onSave?: () => void;
  className?: string;
};

export const ProductTableCell = ({
  field,
  value,
  isEditing,
  onEdit,
  onChange,
  onSave,
  className,
}: ProductTableCellProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log("Double click detected on field:", field);
    e.preventDefault();
    if (!isEditing) {
      onEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onSave?.();
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      onSave?.();
    }
  };

  if (isEditing) {
    if (field === "description") {
      return (
        <div className={cn("min-w-[300px]", className)}>
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full min-h-[60px]"
          />
        </div>
      );
    }

    if (field === "price" || field === "stock_quantity") {
      return (
        <div className={className}>
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            value={value || ""}
            onChange={(e) => onChange(field === "price" ? parseFloat(e.target.value) : parseInt(e.target.value))}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full"
          />
        </div>
      );
    }

    if (field === "status") {
      return (
        <div className={className}>
          <Select 
            value={value || ""} 
            onValueChange={(newValue) => {
              onChange(newValue);
              setTimeout(() => onSave?.(), 0);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div className={className}>
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div 
      onDoubleClick={handleDoubleClick} 
      className={cn(
        "cursor-pointer truncate", 
        field === "description" && "max-w-[300px]",
        className
      )}
    >
      {field === "status" ? (
        <span className={`capitalize ${value === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
          {value}
        </span>
      ) : (
        value
      )}
    </div>
  );
};