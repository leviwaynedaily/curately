import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";

type ProductCardFooterProps = {
  product: Product;
  accentColor?: string;
  secondaryColor?: string;
};

export const ProductCardFooter = ({
  product,
  accentColor = "#000000",
  secondaryColor = "#000000"
}: ProductCardFooterProps) => {
  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <div className="w-full space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-base line-clamp-1 group-hover:text-neutral-700 transition-colors flex-1">
            {product.name}
          </h3>
          {product.category && (
            <span 
              className="inline-block px-2 py-1 text-xs rounded-full whitespace-nowrap"
              style={{ 
                backgroundColor: `${secondaryColor}15`,
                color: secondaryColor,
                border: `1px solid ${secondaryColor}30`
              }}
            >
              {product.category}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.price && (
          <p 
            className="text-base font-semibold" 
            style={{ color: accentColor }}
          >
            {formatCurrency(product.price)}
          </p>
        )}
      </div>
    </div>
  );
};