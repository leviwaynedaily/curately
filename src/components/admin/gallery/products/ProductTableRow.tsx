import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Trash } from "lucide-react";
import { Product } from "./types";

type ProductTableRowProps = {
  product: Product;
  isEditing: boolean;
  editedProduct: Product | null;
  onEdit: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onProductChange: (field: keyof Product, value: any) => void;
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
}: ProductTableRowProps) => {
  return (
    <tr>
      <td>
        {isEditing ? (
          <Input
            value={editedProduct?.name || ""}
            onChange={(e) => onProductChange("name", e.target.value)}
          />
        ) : (
          product.name
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            value={editedProduct?.description || ""}
            onChange={(e) => onProductChange("description", e.target.value)}
          />
        ) : (
          product.description
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            type="number"
            value={editedProduct?.price || ""}
            onChange={(e) =>
              onProductChange("price", parseFloat(e.target.value))
            }
          />
        ) : (
          product.price
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            value={editedProduct?.sku || ""}
            onChange={(e) => onProductChange("sku", e.target.value)}
          />
        ) : (
          product.sku
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            value={editedProduct?.category || ""}
            onChange={(e) => onProductChange("category", e.target.value)}
          />
        ) : (
          product.category
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            type="number"
            value={editedProduct?.stock_quantity || ""}
            onChange={(e) =>
              onProductChange("stock_quantity", parseInt(e.target.value))
            }
          />
        ) : (
          product.stock_quantity
        )}
      </td>
      <td>
        {isEditing ? (
          <Input
            value={editedProduct?.status || ""}
            onChange={(e) => onProductChange("status", e.target.value)}
          />
        ) : (
          product.status
        )}
      </td>
      <td>
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(product)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(product.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};