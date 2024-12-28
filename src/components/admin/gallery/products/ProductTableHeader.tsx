import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProductTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Price</TableHead>
        <TableHead>SKU</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Stock</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};