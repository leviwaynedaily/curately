import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type StorefrontProductListProps = {
  products: Product[];
  accentColor?: string;
  secondaryColor?: string;
};

export const StorefrontProductList = ({ 
  products, 
  accentColor,
  secondaryColor 
}: StorefrontProductListProps) => {
  console.log("Rendering product list with:", { 
    productCount: products.length, 
    products,
    accentColor,
    secondaryColor
  });
  
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage
      .from("gallery_images")
      .getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="flex gap-4 bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
        >
          <div className="w-24 h-24 flex-shrink-0">
            {product.primary_media ? (
              <img
                src={getImageUrl(product.primary_media)}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                No image
              </div>
            )}
          </div>
          <div className="flex-grow">
            <h3 className="font-medium text-lg mb-1">{product.name}</h3>
            {product.description && (
              <p 
                className="text-sm line-clamp-2 mb-2"
                style={{ color: secondaryColor }}
              >
                {product.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div>
                {product.price && (
                  <p className="text-lg font-semibold" style={{ color: accentColor }}>
                    {formatCurrency(product.price)}
                  </p>
                )}
                {product.category && (
                  <span className="text-xs text-gray-500 capitalize">
                    {product.category}
                  </span>
                )}
              </div>
              {product.stock_quantity !== null && (
                <span className="text-sm text-gray-500">
                  Stock: {product.stock_quantity}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};