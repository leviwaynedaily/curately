import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Save, X, Trash, Image as ImageIcon } from "lucide-react";
import { Product } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

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
  const [primaryMedia, setPrimaryMedia] = useState<string | null>(null);
  const [isLoadingMedia, setIsLoadingMedia] = useState(true);

  useEffect(() => {
    const fetchPrimaryMedia = async () => {
      setIsLoadingMedia(true);
      try {
        console.log("Fetching primary media for product:", product.id);
        const { data, error } = await supabase
          .from("product_media")
          .select("file_path")
          .eq("product_id", product.id)
          .eq("is_primary", true)
          .maybeSingle();

        if (error) {
          console.error("Error fetching primary media:", error);
          return;
        }

        if (data) {
          setPrimaryMedia(data.file_path);
        }
      } catch (error) {
        console.error("Error in fetchPrimaryMedia:", error);
      } finally {
        setIsLoadingMedia(false);
      }
    };

    fetchPrimaryMedia();
  }, [product.id]);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {isLoadingMedia ? (
            <div className="w-10 h-10 bg-muted animate-pulse rounded" />
          ) : primaryMedia ? (
            <img
              src={supabase.storage.from("gallery_images").getPublicUrl(primaryMedia).data.publicUrl}
              alt=""
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
          {isEditing ? (
            <Input
              value={editedProduct?.name || ""}
              onChange={(e) => onProductChange("name", e.target.value)}
              className="w-full"
            />
          ) : (
            product.name
          )}
        </div>
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Textarea
            value={editedProduct?.description || ""}
            onChange={(e) => onProductChange("description", e.target.value)}
            className="w-full min-h-[60px]"
          />
        ) : (
          product.description
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedProduct?.price || ""}
            onChange={(e) => onProductChange("price", parseFloat(e.target.value))}
            className="w-full"
          />
        ) : (
          product.price
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedProduct?.sku || ""}
            onChange={(e) => onProductChange("sku", e.target.value)}
            className="w-full"
          />
        ) : (
          product.sku
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedProduct?.category || ""}
            onChange={(e) => onProductChange("category", e.target.value)}
            className="w-full"
          />
        ) : (
          product.category
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            type="number"
            value={editedProduct?.stock_quantity || ""}
            onChange={(e) => onProductChange("stock_quantity", parseInt(e.target.value))}
            className="w-full"
          />
        ) : (
          product.stock_quantity
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select
            value={editedProduct?.status || ""}
            onValueChange={(value) => onProductChange("status", value)}
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
        ) : (
          <span className={`capitalize ${product.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
            {product.status}
          </span>
        )}
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
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};