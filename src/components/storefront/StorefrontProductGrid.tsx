import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type StorefrontProductGridProps = {
  products: Product[];
  accentColor?: string;
};

export const StorefrontProductGrid = ({ products, accentColor }: StorefrontProductGridProps) => {
  console.log("Rendering product grid with:", { productCount: products.length, products });
  
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage
      .from("gallery_images")
      .getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden bg-gray-100">
              {product.primary_media ? (
                <img
                  src={getImageUrl(product.primary_media)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
  );
};