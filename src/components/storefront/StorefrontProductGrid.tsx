import { useState } from "react";
import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProductDetailsDialog } from "./product/ProductDetailsDialog";
import { ProductMediaCarousel } from "./product/ProductMediaCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const handleEditClick = (e: React.MouseEvent, productId: string, storefrontId: string) => {
    e.stopPropagation(); // Prevent opening the product details dialog
    navigate(`/admin/products/${storefrontId}?productId=${productId}`);
  };
  
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-neutral-200 relative"
            onClick={() => setSelectedProduct(product)}
          >
            {session && (
              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                  onClick={(e) => handleEditClick(e, product.id, product.storefront_id)}
                >
                  <Edit className="h-4 w-4" style={{ color: accentColor }} />
                </Button>
              </div>
            )}
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