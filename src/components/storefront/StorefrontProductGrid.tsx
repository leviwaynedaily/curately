import { useState } from "react";
import { Product } from "@/components/admin/gallery/products/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ProductDetailsDialog } from "./product/ProductDetailsDialog";
import { ProductMediaCarousel } from "./product/ProductMediaCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Edit, Trash, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const { session } = useAuth();
  const { toast } = useToast();

  const handleProductClick = (product: Product) => {
    if (isEditMode) {
      // In edit mode, toggle selection
      setSelectedProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(product.id)) {
          newSet.delete(product.id);
        } else {
          newSet.add(product.id);
        }
        return newSet;
      });
    } else {
      // Normal mode, show product details
      setSelectedProduct(product);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) {
      toast({
        description: "Please select products to delete",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("products")
        .update({ status: "archived" })
        .in("id", Array.from(selectedProducts));

      if (error) throw error;

      toast({
        description: `Successfully archived ${selectedProducts.size} product(s)`
      });
      
      setSelectedProducts(new Set());
      // Ideally we would refresh the products list here
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        description: "Failed to delete products",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {session && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant={isEditMode ? "destructive" : "default"}
            onClick={() => {
              setIsEditMode(!isEditMode);
              setSelectedProducts(new Set());
            }}
          >
            {isEditMode ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Exit Edit Mode
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Products
              </>
            )}
          </Button>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDeleteSelected}
              disabled={selectedProducts.size === 0}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Selected ({selectedProducts.size})
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={`group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-neutral-200 relative
              ${isEditMode && selectedProducts.has(product.id) ? 'ring-2 ring-primary' : ''}
            `}
            onClick={() => handleProductClick(product)}
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