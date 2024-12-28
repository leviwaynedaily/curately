import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Storefront } from "@/types/storefront";
import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFilters } from "./StorefrontFilters";
import { StorefrontProductGrid } from "./StorefrontProductGrid";
import { StorefrontLoadingSkeleton } from "./StorefrontLoadingSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type StorefrontViewProps = {
  storefront: Storefront;
  storefrontId: string;
};

export const StorefrontView = ({
  storefront,
  storefrontId,
}: StorefrontViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products", storefrontId],
    queryFn: async () => {
      console.log("Fetching products for storefront:", storefrontId);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media (*)
        `)
        .eq("storefront_id", storefrontId)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      console.log("Products fetched:", data);
      
      if (!data || data.length === 0) {
        console.log("No products found for storefront:", storefrontId);
        return [];
      }

      const productsWithMedia = data.map(product => ({
        ...product,
        primary_media: product.product_media?.find(media => media.is_primary)?.file_path
      }));

      console.log("Products with media:", productsWithMedia);
      return productsWithMedia;
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        product =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [products, searchTerm, categoryFilter, sortBy]);

  if (isLoading) {
    return <StorefrontLoadingSkeleton />;
  }

  if (error) {
    console.error("Error loading products:", error);
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StorefrontHeader storefront={storefront} />
      <StorefrontFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products available at this time.</p>
        </div>
      ) : (
        <StorefrontProductGrid 
          products={filteredAndSortedProducts}
          accentColor={storefront.accent_color}
        />
      )}
    </div>
  );
};