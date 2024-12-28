import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Storefront } from "@/types/storefront";
import { ProductFilters } from "./products/ProductFilters";
import { ProductGrid } from "./products/ProductGrid";

type GalleryContentProps = {
  gallery: Storefront;
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => Promise<void>;
  onUploadComplete: () => Promise<void>;
};

export const GalleryContent = ({
  gallery,
  galleryId,
}: GalleryContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: products = [] } = useQuery({
    queryKey: ["products", galleryId],
    queryFn: async () => {
      console.log("Fetching products for gallery:", galleryId);
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media (*)
        `)
        .eq("storefront_id", galleryId)
        .eq("status", "active");

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      // Add primary_media to each product
      return data.map(product => ({
        ...product,
        primary_media: product.product_media?.find(media => media.is_primary)?.file_path
      }));
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        product =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }

    // Apply sorting
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logo */}
      <div className="flex justify-center mb-12">
        {gallery.site_logo ? (
          <img
            src={supabase.storage.from("gallery_images").getPublicUrl(gallery.site_logo).data.publicUrl}
            alt={gallery.name}
            className="h-16 object-contain"
          />
        ) : (
          <h1 className="text-3xl font-bold text-center">{gallery.name}</h1>
        )}
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      {/* Products Grid */}
      <ProductGrid 
        products={filteredAndSortedProducts}
        accentColor={gallery.accent_color || "#9b87f5"}
      />
    </div>
  );
};