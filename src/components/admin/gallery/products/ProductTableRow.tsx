import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "./types";
import { ProductTableCell } from "./table/cells/ProductTableCell";
import { ProductTableMedia } from "./table/ProductTableMedia";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductActions } from "./table/actions/ProductActions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  const handleCellChange = (field: keyof Product) => (value: any) => {
    onProductChange(field, value);
  };

  const handleArchive = async () => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'archived' })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        description: "Product archived successfully. It will be automatically deleted in 30 days.",
      });

      // Trigger a refresh of the product list
      onSave();
    } catch (error) {
      console.error('Error archiving product:', error);
      toast({
        variant: "destructive",
        description: "Failed to archive product",
      });
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
            onEdit={() => onEdit(product)}
            onChange={handleCellChange("name")}
            onSave={onSave}
            className="flex-1 font-medium"
          />
        </div>
      </TableCell>

      <TableCell className="max-w-[300px]">
        <ProductTableCell
          field="description"
          value={isEditing ? editedProduct?.description : product.description}
          isEditing={isEditing}
          onEdit={() => onEdit(product)}
          onChange={handleCellChange("description")}
          onSave={onSave}
        />
      </TableCell>

      <TableCell className="text-right">
        <ProductTableCell
          field="price"
          value={isEditing ? editedProduct?.price : product.price}
          isEditing={isEditing}
          onEdit={() => onEdit(product)}
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
              onEdit={() => onEdit(product)}
              onChange={handleCellChange("sku")}
              onSave={onSave}
            />
          </TableCell>
          <TableCell className="text-right">
            <ProductTableCell
              field="stock_quantity"
              value={isEditing ? editedProduct?.stock_quantity : product.stock_quantity}
              isEditing={isEditing}
              onEdit={() => onEdit(product)}
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
          onEdit={() => onEdit(product)}
          onChange={handleCellChange("category")}
          onSave={onSave}
        />
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-2">
          <ProductActions
            product={product}
            isEditing={isEditing}
            onEdit={() => onEdit(product)}
            onSave={onSave}
            onCancel={onCancel}
            onDelete={() => onDelete(product.id)}
            onMediaClick={() => onMediaClick(product)}
            onDuplicate={onDuplicate ? () => onDuplicate([product.id]) : undefined}
            onArchive={handleArchive}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};