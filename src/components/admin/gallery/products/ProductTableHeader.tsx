import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  // Fetch tags
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

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

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <TableHeader>
      <TableRow className="border-b-0">
        <TableHead colSpan={7}>
          <div className="flex items-center gap-2 py-2">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Category <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedCategory === ""}
                  onCheckedChange={() => setSelectedCategory("")}
                >
                  All Categories
                </DropdownMenuCheckboxItem>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategory === category}
                    onCheckedChange={() => setSelectedCategory(category || "")}
                  >
                    {category}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  Tag <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filter by tag</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={selectedTag === ""}
                  onCheckedChange={() => setSelectedTag("")}
                >
                  All Tags
                </DropdownMenuCheckboxItem>
                {tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTag === tag.name}
                    onCheckedChange={() => setSelectedTag(tag.name)}
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableHead>
      </TableRow>
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