import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";
import { ProductMediaCarousel } from "./ProductMediaCarousel";

type ProductDetailsDialogProps = {
  product: Product | null;
  onClose: () => void;
  allowDownload?: boolean;
  accentColor?: string;
};

export const ProductDetailsDialog = ({ 
  product, 
  onClose,
  allowDownload = false,
  accentColor = '#8B5CF6' // Default accent color if none provided
}: ProductDetailsDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-lg border shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-50 rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
          onClick={onClose}
        >
          <X className="h-4 w-4" style={{ color: accentColor }} />
        </Button>

        <div>
          <div className="aspect-square w-full overflow-hidden">
            <ProductMediaCarousel 
              media={product.product_media || []}
              allowDownload={allowDownload}
            />
          </div>
          
          <div className="p-4 space-y-3 bg-white">
            <h2 className="text-xl font-semibold leading-tight">{product.name}</h2>
            {product.price && (
              <p className="text-lg font-bold" style={{ color: accentColor }}>
                {formatCurrency(product.price)}
              </p>
            )}
            {product.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            )}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Category: {product.category}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};