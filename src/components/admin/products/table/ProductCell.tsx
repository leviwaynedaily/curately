import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Product } from "../../../admin/gallery/products/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProductCellProps = {
  product: Product;
  onRefetch: () => void;
};

export const ProductCell = ({ product, onRefetch }: ProductCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(product.name);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ name: value })
        .eq("id", product.id);

      if (error) throw error;

      toast({ description: "Product name updated" });
      onRefetch();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to update product name",
      });
    } finally {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSave();
          } else if (e.key === "Escape") {
            setIsEditing(false);
            setValue(product.name);
          }
        }}
        autoFocus
      />
    );
  }

  return (
    <div
      className="cursor-pointer hover:text-primary"
      onClick={() => setIsEditing(true)}
    >
      {product.name}
    </div>
  );
};