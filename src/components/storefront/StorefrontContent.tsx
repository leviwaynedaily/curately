import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFilters } from "./StorefrontFilters";
import { StorefrontProductGrid } from "./StorefrontProductGrid";
import { StorefrontProductList } from "./StorefrontProductList";
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
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  onLogoClick?: () => void;
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
  viewMode,
  onViewModeChange,
  onLogoClick,
}: StorefrontContentProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <StorefrontHeader 
        storefront={storefront} 
        onLogoClick={onLogoClick}
        showDescription={storefront.show_description}
      />
      <div className="space-y-4">
        <StorefrontFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          categoryFilter={categoryFilter}
          onCategoryChange={onCategoryChange}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
        {products.length > 0 ? (
          viewMode === "grid" ? (
            <StorefrontProductGrid 
              products={products}
              accentColor={storefront.accent_color}
              secondaryColor={storefront.secondary_color}
              allowDownload={false}
            />
          ) : (
            <StorefrontProductList
              products={products}
              accentColor={storefront.accent_color}
            />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};