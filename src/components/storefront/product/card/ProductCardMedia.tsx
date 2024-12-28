import { Product } from "@/components/admin/gallery/products/types";
import { ProductMediaCarousel } from "../ProductMediaCarousel";

type ProductCardMediaProps = {
  product: Product;
  allowDownload?: boolean;
};

export const ProductCardMedia = ({
  product,
  allowDownload = false,
}: ProductCardMediaProps) => {
  return (
    <div className="p-0 relative">
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
    </div>
  );
};