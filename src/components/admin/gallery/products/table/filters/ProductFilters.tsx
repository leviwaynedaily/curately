import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Product } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ProductFiltersProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  products: Product[];
};

export const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedTag,
  setSelectedTag,
  products,
}: ProductFiltersProps) => {
  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

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

  return (
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
  );
};