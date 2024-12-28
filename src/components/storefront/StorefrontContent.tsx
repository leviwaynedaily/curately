import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFilters } from "./StorefrontFilters";
import { StorefrontProductGrid } from "./StorefrontProductGrid";
import { Product } from "@/components/admin/gallery/products/types";
import { Storefront } from "@/types/storefront";

type StorefrontContentProps = {
  storefront: Storefront;
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
};

export const StorefrontContent = ({
  storefront,
  products,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  categoryFilter,
  onCategoryChange,
  categories,
}: StorefrontContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <StorefrontHeader storefront={storefront} />
      <StorefrontFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />
      {products.length > 0 ? (
        <StorefrontProductGrid 
          products={products}
          accentColor={storefront.accent_color}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found.</p>
        </div>
      )}
    </div>
  );
};