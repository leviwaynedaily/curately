import { useState } from "react";
import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProductDetailsDialog } from "./product/ProductDetailsDialog";
import { ProductMediaCarousel } from "./product/ProductMediaCarousel";

type StorefrontProductGridProps = {
  products: Product[];
  accentColor?: string;
  allowDownload?: boolean;
};

export const StorefrontProductGrid = ({ 
  products,
  accentColor,
  allowDownload = false
}: StorefrontProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => setSelectedProduct(product)}
          >
            <CardContent className="p-0">
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
            <CardFooter className="flex flex-col items-start gap-1 p-3">
              <h3 className="font-medium text-base line-clamp-1">{product.name}</h3>
              {product.price && (
                <p className="text-base font-semibold" style={{ color: accentColor }}>
                  {formatCurrency(product.price)}
                </p>
              )}
              {product.category && (
                <span className="text-xs text-gray-500 capitalize">
                  {product.category}
                </span>
              )}
            </CardFooter>
          </Card>
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