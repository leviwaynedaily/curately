import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";
import { ProductMediaCarousel } from "./ProductMediaCarousel";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ProductDetailsDialogProps = {
  product: Product | null;
  onClose: () => void;
  allowDownload?: boolean;
};

export const ProductDetailsDialog = ({ 
  product, 
  onClose,
  allowDownload = false
}: ProductDetailsDialogProps) => {
  if (!product) return null;

  const handleDownload = async (mediaPath: string) => {
    const { data } = supabase.storage
      .from("gallery_images")
      .getPublicUrl(mediaPath);
      
    // Create a temporary anchor element to trigger the download
    const link = document.createElement("a");
    link.href = data.publicUrl;
    link.download = mediaPath.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <div className="space-y-4">
          <ProductMediaCarousel 
            media={product.product_media || []}
            allowDownload={allowDownload}
            onDownload={handleDownload}
          />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            {product.price && (
              <p className="text-xl font-bold">
                {formatCurrency(product.price)}
              </p>
            )}
            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}
            {product.category && (
              <p className="text-sm text-gray-500">
                Category: {product.category}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};