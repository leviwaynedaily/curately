import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProductMediaCarousel } from "./ProductMediaCarousel";
import { ProductCardActions } from "./ProductCardActions";
import { Checkbox } from "@/components/ui/checkbox";

type ProductCardProps = {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string) => void;
  onProductClick: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  isAdmin: boolean;
  isEditMode: boolean;
  accentColor?: string;
  allowDownload?: boolean;
};

export const ProductCard = ({
  product,
  isSelected,
  onSelect,
  onProductClick,
  onDeleteProduct,
  isAdmin,
  isEditMode,
  accentColor,
  allowDownload = false,
}: ProductCardProps) => {
  const handleCardClick = () => {
    if (isEditMode && isAdmin) {
      onSelect(product.id);
    } else {
      onProductClick(product);
    }
  };

  return (
    <Card 
      className={`group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-neutral-200 relative
        ${isEditMode && isSelected ? 'ring-2 ring-primary' : ''}
      `}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 relative">
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
            onEdit={() => onProductClick(product)}
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
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2 p-4">
        <div className="w-full space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base line-clamp-1 group-hover:text-neutral-700 transition-colors flex-1">
              {product.name}
            </h3>
            {product.category && (
              <span 
                className="inline-block px-2 py-1 text-xs rounded-full whitespace-nowrap"
                style={{ 
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                  border: `1px solid ${accentColor}30`
                }}
              >
                {product.category}
              </span>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
          {product.price && (
            <p 
              className="text-base font-semibold" 
              style={{ color: accentColor }}
            >
              {formatCurrency(product.price)}
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};