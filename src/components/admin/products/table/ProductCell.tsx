import { Product } from "../../gallery/products/types";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type ProductCellProps = {
  product: Product;
  onUpdate: (product: Product) => void;
};

export const ProductCell = ({ product, onUpdate }: ProductCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(product.name);

  const handleBlur = () => {
    if (editedName !== product.name) {
      onUpdate({ ...product, name: editedName });
    }
    setIsEditing(false);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage
      .from("gallery_images")
      .getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-12 flex-shrink-0">
        {product.primary_media ? (
          <img
            src={getImageUrl(product.primary_media)}
            alt={product.name}
            className="h-full w-full object-cover rounded"
          />
        ) : (
          <div className="h-full w-full bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs">
            No image
          </div>
        )}
      </div>
      
      {isEditing ? (
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBlur();
            }
          }}
          autoFocus
          className="max-w-[200px]"
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-left hover:text-primary transition-colors"
        >
          {product.name}
        </button>
      )}
    </div>
  );
};