import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

type ProductTableHeaderProps = {
  onSort: (field: keyof Product) => void;
  sortField: keyof Product | null;
  sortDirection: "asc" | "desc" | null;
  showHiddenFields: boolean;
  onToggleHiddenFields: () => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
};

export const ProductTableHeader = ({
  onSort,
  sortField,
  sortDirection,
  showHiddenFields,
  onToggleHiddenFields,
  onSelectAll,
  allSelected,
}: ProductTableHeaderProps) => {
  const SortableHeader = ({ field, children, className }: { field: keyof Product; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
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
        <TableHead className="w-[40px] pl-4">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <SortableHeader field="name">
          <div className="flex-1">Name</div>
        </SortableHeader>
        <TableHead className="max-w-[300px]">Description</TableHead>
        <SortableHeader field="price" className="text-right">Price</SortableHeader>
        {showHiddenFields && (
          <>
            <SortableHeader field="sku">SKU</SortableHeader>
            <SortableHeader field="stock_quantity" className="text-right">Stock</SortableHeader>
          </>
        )}
        <SortableHeader field="category">Category</SortableHeader>
        <TableHead className="w-[100px]">
          <TooltipProvider>
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
          </TooltipProvider>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};