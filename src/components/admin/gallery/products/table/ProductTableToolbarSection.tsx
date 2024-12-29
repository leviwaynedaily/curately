import { Input } from "@/components/ui/input";
import { ProductBulkActions } from "./ProductBulkActions";
import { Product } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, Star, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProductTableToolbarSectionProps = {
  selectedProducts: Set<string>;
  onDuplicate: (productIds: string[]) => void;
  onDelete: (productIds: string[]) => void;
  products: Product[];
  onSelectAll: (checked: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
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
}: ProductTableToolbarSectionProps) => {
  return (
    <div className="space-y-4">
      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
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
            {/* Add vendor options here */}
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
            {/* Add tag options here */}
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
            {/* Add status options here */}
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

      <ProductBulkActions
        selectedProducts={selectedProducts}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        products={products}
        onSelectAll={onSelectAll}
      />
    </div>
  );
};