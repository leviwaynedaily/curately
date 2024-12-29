import { Button } from "@/components/ui/button";
import { Edit, Save, X, Trash, Image as ImageIcon, Copy, Loader2 } from "lucide-react";
import { Product } from "./types";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductTableCell } from "./table/ProductTableCell";
import { ProductTableMedia } from "./table/ProductTableMedia";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

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
  showHiddenFields: boolean;
  className?: string;
  selected?: boolean;
  onToggleSelect?: () => void;
  onDuplicate?: (productIds: string[]) => void;
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
  showHiddenFields,
  className,
  selected,
  onToggleSelect,
  onDuplicate,
}: ProductTableRowProps) => {
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleCellChange = (field: keyof Product) => (value: any) => {
    onProductChange(field, value);
  };

  const handleCellEdit = () => {
    if (!isEditing) {
      onEdit(product);
    }
  };

  const handleDuplicate = async () => {
    console.log("Duplicating single product:", product.id);
    if (onDuplicate) {
      setIsDuplicating(true);
      try {
        await onDuplicate([product.id]);
      } finally {
        setIsDuplicating(false);
      }
    }
  };

  return (
    <TableRow className={cn("h-[72px]", className, selected && "bg-accent/50")}>
      <TableCell className="w-[40px] pl-4">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggleSelect}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ProductTableMedia productId={product.id} />
          <ProductTableCell
            field="name"
            value={isEditing ? editedProduct?.name : product.name}
            isEditing={isEditing}
            onEdit={handleCellEdit}
            onChange={handleCellChange("name")}
            onSave={onSave}
            className="flex-1 font-medium"
          />
        </div>
      </TableCell>

      <TableCell className="max-w-[300px]">
        <div className="truncate">
          <ProductTableCell
            field="description"
            value={isEditing ? editedProduct?.description : product.description}
            isEditing={isEditing}
            onEdit={handleCellEdit}
            onChange={handleCellChange("description")}
            onSave={onSave}
          />
        </div>
      </TableCell>

      <TableCell className="text-right">
        <ProductTableCell
          field="price"
          value={isEditing ? editedProduct?.price : product.price}
          isEditing={isEditing}
          onEdit={handleCellEdit}
          onChange={handleCellChange("price")}
          onSave={onSave}
        />
      </TableCell>

      {showHiddenFields && (
        <>
          <TableCell>
            <ProductTableCell
              field="sku"
              value={isEditing ? editedProduct?.sku : product.sku}
              isEditing={isEditing}
              onEdit={handleCellEdit}
              onChange={handleCellChange("sku")}
              onSave={onSave}
            />
          </TableCell>
          <TableCell className="text-right">
            <ProductTableCell
              field="stock_quantity"
              value={isEditing ? editedProduct?.stock_quantity : product.stock_quantity}
              isEditing={isEditing}
              onEdit={handleCellEdit}
              onChange={handleCellChange("stock_quantity")}
              onSave={onSave}
            />
          </TableCell>
        </>
      )}

      <TableCell>
        <ProductTableCell
          field="category"
          value={isEditing ? editedProduct?.category : product.category}
          isEditing={isEditing}
          onEdit={handleCellEdit}
          onChange={handleCellChange("category")}
          onSave={onSave}
        />
      </TableCell>

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
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDuplicate}
                disabled={isDuplicating}
              >
                {isDuplicating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};