import { Product } from "@/components/admin/gallery/products/types";
import { ProductMediaCarousel } from "../ProductMediaCarousel";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCardActions } from "../ProductCardActions";

type ProductCardMediaProps = {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onEdit: () => void;
  isAdmin: boolean;
  isEditMode: boolean;
  allowDownload?: boolean;
};

export const ProductCardMedia = ({
  product,
  isSelected,
  onSelect,
  onDeleteProduct,
  onEdit,
  isAdmin,
  isEditMode,
  allowDownload = false,
}: ProductCardMediaProps) => {
  return (
    <div className="p-0 relative">
      {isAdmin && isEditMode && (
        <div 
          className="absolute top-2 left-2 z-20" 
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product.id);
          }}
        >
          <Checkbox
            checked={isSelected}
            className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
          />
        </div>
      )}
      
      {isAdmin && !isEditMode && (
        <ProductCardActions 
          product={product}
          onDelete={onDeleteProduct}
          onEdit={onEdit}
        />
      )}

      <div className="aspect-square overflow-hidden bg-gray-100">
        {product.product_media && product.product_media.length > 0 ? (
          <ProductMediaCarousel 
            media={product.product_media}
            allowDownload={allowDownload}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </div>
    </div>
  );
};