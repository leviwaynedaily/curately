import { Product } from "../../types";
import { useState } from "react";
import { EditableCell } from "./EditableCell";
import { DisplayCell } from "./DisplayCell";

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
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = (newValue: string | number) => {
    onChange(newValue);
    setIsEditMode(false);
    onSave?.();
  };

  const handleCancel = () => {
    setIsEditMode(false);
  };

  const handleStartEdit = () => {
    console.log("Starting edit for field:", field);
    setIsEditMode(true);
    onEdit();
  };

  if (isEditing || isEditMode) {
    const type = field === 'description' ? 'textarea' 
      : (field === 'price' || field === 'stock_quantity') ? 'number'
      : 'text';

    return (
      <EditableCell
        value={value || ''}
        type={type}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  const cellType = field === 'price' ? 'price'
    : (field === 'stock_quantity' ? 'number' : 'text');

  return (
    <DisplayCell
      value={value}
      onClick={handleStartEdit}
      className={className}
      type={cellType}
    />
  );
};