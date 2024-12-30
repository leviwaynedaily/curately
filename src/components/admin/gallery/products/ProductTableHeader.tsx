import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductFilters } from "./table/filters/ProductFilters";

type ProductTableHeaderProps = {
  onSort: (field: keyof Product) => void;
  sortField: keyof Product | null;
  sortDirection: "asc" | "desc" | null;
  showHiddenFields: boolean;
  onToggleHiddenFields: () => void;
  onSelectAll?: (checked: boolean) => void;
  allSelected?: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
};

export const ProductTableHeader = ({
  onSort,
  sortField,
  sortDirection,
  showHiddenFields,
  onToggleHiddenFields,
  onSelectAll,
  allSelected,
  searchTerm,
  setSearchTerm,
  products,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
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
      <TableRow className="border-b-0">
        <TableHead colSpan={7}>
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            products={products}
          />
        </TableHead>
      </TableRow>
      <TableRow>
        <TableHead className="w-[40px] pl-4">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={onSelectAll}
            className="border-2 border-gray-300 data-[state=checked]:border-primary rounded-sm"
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
                  <Filter className="h-4 w-4" />
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