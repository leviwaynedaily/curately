import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "../../gallery/products/types";
import { ProductActions } from "./ProductActions";
import { ProductCell } from "./ProductCell";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type ProductTableContentProps = {
  products: Product[];
  isLoading: boolean;
  selectedProducts: Set<string>;
  onToggleSelect: (productId: string) => void;
  onUpdate: (product: Product) => void;
};

export const ProductTableContent = ({
  products,
  isLoading,
  selectedProducts,
  onToggleSelect,
  onUpdate,
}: ProductTableContentProps) => {
  if (isLoading) {
    return (
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-4" /></TableCell>
            <TableCell><Skeleton className="h-12 w-full" /></TableCell>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-4 w-16" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableBody>
      {products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>
            <Checkbox
              checked={selectedProducts.has(product.id)}
              onCheckedChange={() => onToggleSelect(product.id)}
              aria-label={`Select ${product.name}`}
            />
          </TableCell>
          <TableCell>
            <ProductCell product={product} onUpdate={onUpdate} />
          </TableCell>
          <TableCell>
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
            </Badge>
          </TableCell>
          <TableCell>{product.category || '-'}</TableCell>
          <TableCell className="text-right">
            {product.price ? formatCurrency(product.price) : '-'}
          </TableCell>
          <TableCell className="text-right">
            {product.stock_quantity ?? '-'}
          </TableCell>
          <TableCell>
            <ProductActions product={product} onUpdate={onUpdate} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};