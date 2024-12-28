import { useState } from "react";
import { Product } from "@/components/admin/gallery/products/types";
import { ProductDetailsDialog } from "./product/ProductDetailsDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const { session } = useAuth();
  const { toast } = useToast();

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      console.log("Deleting product:", productId);
      const { error } = await supabase
        .from("products")
        .update({ status: "archived" })
        .eq("id", productId);

      if (error) throw error;

      toast({
        description: "Product deleted successfully"
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        description: "Failed to delete product",
        variant: "destructive"
      });
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
      console.log("Deleting products:", Array.from(selectedProducts));
      const { error } = await supabase
        .from("products")
        .update({ status: "archived" })
        .in("id", Array.from(selectedProducts));

      if (error) throw error;

      setSelectedProducts(new Set());
      setIsEditMode(false);

      toast({
        description: `Successfully deleted ${selectedProducts.size} product(s)`
      });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error deleting products:", error);
      toast({
        description: "Failed to delete products",
        variant: "destructive"
      });
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  return (
    <>
      {session && isEditMode && (
        <div className="flex justify-end gap-2 mb-4">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={selectedProducts.size === 0}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected ({selectedProducts.size})
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isSelected={selectedProducts.has(product.id)}
            onSelect={toggleProductSelection}
            onProductClick={handleProductClick}
            onDeleteProduct={handleDeleteProduct}
            isAdmin={!!session}
            isEditMode={isEditMode}
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