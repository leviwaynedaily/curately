import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortField = "name" | "price" | "sku" | "category" | "stock_quantity" | "status";

type ProductTableHeaderProps = {
  onSort: (field: SortField) => void;
  sortField: SortField | null;
  sortDirection: "asc" | "desc" | null;
};

export const ProductTableHeader = ({
  onSort,
  sortField,
  sortDirection,
}: ProductTableHeaderProps) => {
  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(field)}
        className="flex items-center gap-2 hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow>
        <SortableHeader field="name">Name</SortableHeader>
        <TableHead>Description</TableHead>
        <SortableHeader field="price">Price</SortableHeader>
        <SortableHeader field="sku">SKU</SortableHeader>
        <SortableHeader field="category">Category</SortableHeader>
        <SortableHeader field="stock_quantity">Stock</SortableHeader>
        <SortableHeader field="status">Status</SortableHeader>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};