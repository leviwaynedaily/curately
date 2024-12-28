import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ProductTableHeaderProps = {
  onSort: (field: keyof Product) => void;
  sortField: keyof Product | null;
  sortDirection: "asc" | "desc" | null;
  showHiddenFields: boolean;
  onToggleHiddenFields: () => void;
};

export const ProductTableHeader = ({
  onSort,
  sortField,
  sortDirection,
  showHiddenFields,
  onToggleHiddenFields,
}: ProductTableHeaderProps) => {
  const SortableHeader = ({ field, children }: { field: keyof Product; children: React.ReactNode }) => (
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

  const hiddenFields = ["sku", "stock_quantity"];
  const visibleFields = showHiddenFields ? [] : hiddenFields;

  return (
    <TableHeader>
      <TableRow>
        <SortableHeader field="name">
          <div className="flex-1">Name</div>
        </SortableHeader>
        <TableHead>Description</TableHead>
        <SortableHeader field="price">Price</SortableHeader>
        {showHiddenFields && (
          <>
            <SortableHeader field="sku">SKU</SortableHeader>
            <SortableHeader field="stock_quantity">Stock</SortableHeader>
          </>
        )}
        <SortableHeader field="category">Category</SortableHeader>
        <SortableHeader field="status">Status</SortableHeader>
        <TableHead className="w-[100px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleHiddenFields}
                className="hover:bg-transparent"
              >
                <EyeOff className="h-4 w-4" />
                {visibleFields.length > 0 && (
                  <span className="ml-1 text-xs">{visibleFields.length}</span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showHiddenFields ? "Hide optional fields" : `Show ${visibleFields.length} hidden fields`}
            </TooltipContent>
          </Tooltip>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};