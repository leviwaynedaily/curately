import { Product } from "@/components/admin/gallery/products/types";
import { Card } from "@/components/ui/card";
import { ProductCardMedia } from "./card/ProductCardMedia";
import { ProductCardFooter } from "./card/ProductCardFooter";

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
  secondaryColor?: string;
};

export const ProductCard = ({
  product,
  isSelected,
  onSelect,
  onProductClick,
  onDeleteProduct,
  isAdmin,
  isEditMode,
  accentColor = "#000000",
  allowDownload = false,
  secondaryColor = "#000000",
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
      <ProductCardMedia
        product={product}
        isSelected={isSelected}
        onSelect={onSelect}
        onDeleteProduct={onDeleteProduct}
        onEdit={() => onProductClick(product)}
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        allowDownload={allowDownload}
      />
      <ProductCardFooter
        product={product}
        accentColor={accentColor}
        secondaryColor={secondaryColor}
      />
    </Card>
  );
};