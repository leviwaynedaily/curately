import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "../../gallery/products/types";

type ProductTableHeaderProps = {
  products: Product[];
  selectedProducts: Set<string>;
  onSelectAll: (checked: boolean) => void;
};

export const ProductTableHeader = ({
  products,
  selectedProducts,
  onSelectAll,
}: ProductTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={selectedProducts.size === products.length && products.length > 0}
            onCheckedChange={onSelectAll}
            aria-label="Select all products"
          />
        </TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Category</TableHead>
        <TableHead className="text-right">Price</TableHead>
        <TableHead className="text-right">Stock</TableHead>
        <TableHead className="w-12"></TableHead>
      </TableRow>
    </TableHeader>
  );
};