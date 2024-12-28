import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";
import { ProductMediaCarousel } from "./ProductMediaCarousel";

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

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-lg">
            <ProductMediaCarousel 
              media={product.product_media || []}
              allowDownload={allowDownload}
            />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            {product.price && (
              <p className="text-lg font-bold">
                {formatCurrency(product.price)}
              </p>
            )}
            {product.description && (
              <p className="text-sm text-gray-600">{product.description}</p>
            )}
            {product.category && (
              <p className="text-xs text-gray-500">
                Category: {product.category}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};