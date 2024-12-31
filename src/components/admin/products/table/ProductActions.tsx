import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Copy } from "lucide-react";
import { useState } from "react";
import { Product } from "../../../admin/gallery/products/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProductActionsProps = {
  product: Product;
  onRefetch: () => void;
};

export const ProductActions = ({ product, onRefetch }: ProductActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast({ description: "Product deleted successfully" });
      onRefetch();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete product",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const { data: newProduct, error: productError } = await supabase
        .from("products")
        .insert({
          ...product,
          id: undefined,
          name: `${product.name} (Copy)`,
          created_at: undefined,
          updated_at: undefined
        })
        .select()
        .single();

      if (productError) throw productError;

      // Duplicate media if exists
      const { data: mediaData } = await supabase
        .from("product_media")
        .select("*")
        .eq("product_id", product.id);

      if (mediaData) {
        for (const media of mediaData) {
          const { error: mediaError } = await supabase
            .from("product_media")
            .insert({
              ...media,
              id: undefined,
              product_id: newProduct.id,
              created_at: undefined,
              updated_at: undefined
            });

          if (mediaError) throw mediaError;
        }
      }

      toast({ description: "Product duplicated successfully" });
      onRefetch();
    } catch (error) {
      console.error("Error duplicating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to duplicate product",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.location.href = `/admin/products/${product.id}`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};