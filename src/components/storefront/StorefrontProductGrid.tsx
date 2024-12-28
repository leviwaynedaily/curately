import { useState } from "react";
import { Product } from "@/components/admin/gallery/products/types";
import { ProductDetailsDialog } from "./product/ProductDetailsDialog";
import { ProductCard } from "./product/ProductCard";

type StorefrontProductGridProps = {
  products: Product[];
  accentColor?: string;
  secondaryColor?: string;
  allowDownload?: boolean;
};

export const StorefrontProductGrid = ({ 
  products,
  accentColor,
  secondaryColor,
  allowDownload = false
}: StorefrontProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={handleProductClick}
            accentColor={accentColor}
            allowDownload={allowDownload}
            secondaryColor={secondaryColor}
          />
        ))}
      </div>

      <ProductDetailsDialog
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        allowDownload={allowDownload}
        accentColor={accentColor}
      />
    </>
  );
};