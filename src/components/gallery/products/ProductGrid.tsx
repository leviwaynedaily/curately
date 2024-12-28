import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type ProductGridProps = {
  products: Product[];
  accentColor?: string;
};

export const ProductGrid = ({ products, accentColor }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square overflow-hidden bg-gray-100">
              {product.primary_media ? (
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(product.primary_media).data.publicUrl}
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
          <CardFooter className="flex flex-col items-start gap-2 p-4">
            <h3 className="font-medium text-lg">{product.name}</h3>
            {product.price && (
              <p className="text-lg font-semibold" style={{ color: accentColor }}>
                {formatCurrency(product.price)}
              </p>
            )}
            {product.category && (
              <span className="text-sm text-gray-500 capitalize">
                {product.category}
              </span>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};