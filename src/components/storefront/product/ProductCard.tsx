import { Product } from "@/components/admin/gallery/products/types";
import { Card } from "@/components/ui/card";
import { ProductCardMedia } from "./card/ProductCardMedia";
import { ProductCardFooter } from "./card/ProductCardFooter";

type ProductCardProps = {
  product: Product;
  onProductClick: (product: Product) => void;
  accentColor?: string;
  allowDownload?: boolean;
  secondaryColor?: string;
};

export const ProductCard = ({
  product,
  onProductClick,
  accentColor = "#000000",
  allowDownload = false,
  secondaryColor = "#000000",
}: ProductCardProps) => {
  return (
    <Card 
      className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-neutral-200"
      onClick={() => onProductClick(product)}
    >
      <ProductCardMedia
        product={product}
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