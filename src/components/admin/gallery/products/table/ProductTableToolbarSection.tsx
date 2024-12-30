import { Input } from "@/components/ui/input";
import { ProductBulkActions } from "./ProductBulkActions";
import { Product } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, Star, ArrowUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductTableToolbarSectionProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => Promise<void>;
  onDelete: (productIds: string[]) => Promise<void>;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onAddProduct?: () => void;
};

export const ProductTableToolbarSection = ({
  selectedProducts,
  onDuplicate,
  onDelete,
  products,
  onSelectAll,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onAddProduct,
}: ProductTableToolbarSectionProps) => {
  console.log("ProductTableToolbarSection render:", {
    selectedCount: selectedProducts.size,
    totalProducts: products.length,
    hasAddHandler: !!onAddProduct
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedProducts.size > 0 && (
            <ProductBulkActions
              selectedProducts={selectedProducts}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              products={products}
              onSelectAll={onSelectAll}
            />
          )}
        </div>
        
        {onAddProduct && (
          <Button 
            onClick={onAddProduct}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Button>
        )}
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center gap-2 border rounded-md p-2">
        <div className="flex-1">
          <Input
            placeholder="Filter products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Product vendor <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select vendor</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Tagged with <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              Status <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select status</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" className="gap-2">
          More filters <Filter className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <Star className="h-4 w-4" /> Saved
        </Button>

        <Button variant="outline" size="sm" className="gap-2">
          <ArrowUpDown className="h-4 w-4" /> Sort
        </Button>
      </div>
    </div>
  );
};