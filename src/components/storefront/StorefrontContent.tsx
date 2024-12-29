import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFilters } from "./StorefrontFilters";
import { StorefrontProductGrid } from "./StorefrontProductGrid";
import { StorefrontProductList } from "./StorefrontProductList";
import { Product } from "@/components/admin/gallery/products/types";
import { Storefront } from "@/types/storefront";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

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
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Mobile sticky header */}
      {isMobile && isScrolled && (
        <div
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-lg shadow-sm"
          style={{ 
            paddingTop: "env(safe-area-inset-top, 0px)",
          }}
        >
          <div className="px-4 py-2">
            <StorefrontHeader 
              storefront={storefront} 
              onLogoClick={onLogoClick}
              showDescription={false}
              compact={true}
            />
          </div>
        </div>
      )}

      {/* Main content with proper mobile spacing */}
      <div 
        className="container mx-auto px-4"
        style={{ 
          paddingTop: isMobile ? "calc(env(safe-area-inset-top, 20px) + 1rem)" : "2rem",
          paddingBottom: "env(safe-area-inset-bottom, 20px)"
        }}
      >
        {/* Main header - only show when not scrolled on mobile */}
        {(!isMobile || !isScrolled) && (
          <StorefrontHeader 
            storefront={storefront} 
            onLogoClick={onLogoClick}
            showDescription={storefront.show_description}
          />
        )}
        
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
    </div>
  );
};