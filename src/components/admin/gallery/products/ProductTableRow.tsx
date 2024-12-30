import { TableCell, TableRow } from "@/components/ui/table";
import { Product } from "./types";
import { ProductTableCell } from "./table/cells/ProductTableCell";
import { ProductTableMedia } from "./table/ProductTableMedia";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductActions } from "./table/actions/ProductActions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { ProductForm } from "./ProductForm";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  
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

      onSave();
    } catch (error) {
      console.error('Error archiving product:', error);
      toast({
        variant: "destructive",
        description: "Failed to archive product",
      });
    }
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't open form if clicking on a button or checkbox
    if (
      e.target instanceof HTMLElement && 
      (e.target.closest('button') || e.target.closest('[role="checkbox"]'))
    ) {
      return;
    }
    setIsFormOpen(true);
  };

  return (
    <>
      <TableRow 
        className={cn("h-[72px] cursor-pointer hover:bg-accent/50", className, selected && "bg-accent/50")}
        onClick={handleRowClick}
      >
        <TableCell className="w-[40px] pl-4">
          <Checkbox
            checked={selected}
            onCheckedChange={onToggleSelect}
            className="border-2 border-gray-300 data-[state=checked]:bg-transparent data-[state=checked]:border-primary"
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
              onChange={onProductChange}
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
            onChange={onProductChange}
            onSave={onSave}
          />
        </TableCell>

        <TableCell className="text-right">
          <ProductTableCell
            field="price"
            value={isEditing ? editedProduct?.price : product.price}
            isEditing={isEditing}
            onEdit={() => onEdit(product)}
            onChange={onProductChange}
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
                onChange={onProductChange}
                onSave={onSave}
              />
            </TableCell>
            <TableCell className="text-right">
              <ProductTableCell
                field="stock_quantity"
                value={isEditing ? editedProduct?.stock_quantity : product.stock_quantity}
                isEditing={isEditing}
                onEdit={() => onEdit(product)}
                onChange={onProductChange}
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
            onChange={onProductChange}
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

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        storefrontId={product.storefront_id}
        onProductCreated={onSave}
        product={product}
      />
    </>
  );
};
