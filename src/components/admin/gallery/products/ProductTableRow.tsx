import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash, Image as ImageIcon } from "lucide-react";
import { Product } from "./types";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductTableCell } from "./table/ProductTableCell";
import { ProductTableMedia } from "./table/ProductTableMedia";

type ProductTableRowProps = {
  product: Product;
  isEditing: boolean;
  editedProduct: Product | null;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onProductChange: (field: keyof Product, value: any) => void;
  onMediaClick: (product: Product) => void;
};

export const ProductTableRow = ({
  product,
  isEditing,
  editedProduct,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onProductChange,
  onMediaClick,
}: ProductTableRowProps) => {
  const handleCellChange = (field: keyof Product) => (value: any) => {
    onProductChange(field, value);
  };

  const handleCellEdit = () => {
    if (!isEditing) {
      onEdit(product);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProductTableMedia productId={product.id} />
          <ProductTableCell
            field="name"
            value={isEditing ? editedProduct?.name : product.name}
            isEditing={isEditing}
            onEdit={handleCellEdit}
            onChange={handleCellChange("name")}
          />
        </div>
      </TableCell>

      {(["description", "price", "sku", "category", "stock_quantity", "status"] as const).map((field) => (
        <ProductTableCell
          key={field}
          field={field}
          value={isEditing ? editedProduct?.[field] : product[field]}
          isEditing={isEditing}
          onEdit={handleCellEdit}
          onChange={handleCellChange(field)}
        />
      ))}

      <TableCell>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="icon" onClick={onSave}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)}>
                <Trash className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onMediaClick(product)}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};