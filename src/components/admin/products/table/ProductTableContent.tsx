import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "../../../admin/gallery/products/types";
import { ProductCell } from "./ProductCell";
import { ProductActions } from "./ProductActions";
import { formatCurrency } from "@/lib/utils";

type ProductTableContentProps = {
  products: Product[];
  isLoading: boolean;
  selectedProducts: Set<string>;
  setSelectedProducts: (products: Set<string>) => void;
  onRefetch: () => void;
};

export const ProductTableContent = ({
  products,
  isLoading,
  selectedProducts,
  setSelectedProducts,
  onRefetch,
}: ProductTableContentProps) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleSelectProduct = (productId: string) => {
    const newSelection = new Set(selectedProducts);
    if (newSelection.has(productId)) {
      newSelection.delete(productId);
    } else {
      newSelection.add(productId);
    }
    setSelectedProducts(newSelection);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedProducts.size === products.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.has(product.id)}
                  onCheckedChange={() => handleSelectProduct(product.id)}
                />
              </TableCell>
              <TableCell>
                <ProductCell product={product} onRefetch={onRefetch} />
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.status}
                </span>
              </TableCell>
              <TableCell>{product.price ? formatCurrency(product.price) : '-'}</TableCell>
              <TableCell>{product.stock_quantity ?? '-'}</TableCell>
              <TableCell>
                <ProductActions product={product} onRefetch={onRefetch} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};