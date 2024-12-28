import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useStorefront } from "@/hooks/useStorefront";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AgeVerification } from "@/components/AgeVerification";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { StorefrontHeader } from "@/components/storefront/StorefrontHeader";
import { StorefrontFilters } from "@/components/storefront/StorefrontFilters";
import { StorefrontProductGrid } from "@/components/storefront/StorefrontProductGrid";
import { StorefrontLoadingSkeleton } from "@/components/storefront/StorefrontLoadingSkeleton";
import { Product } from "@/components/admin/gallery/products/types";

const StorefrontView = () => {
  const { storefrontId } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { 
    storefront, 
    isLoading: isStorefrontLoading, 
    error: storefrontError 
  } = useStorefront(storefrontId);

  // Fetch products
  const { data: products = [], isLoading: isProductsLoading } = useQuery({
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
      return data.map((product: Product) => ({
        ...product,
        primary_media: product.product_media?.find(media => media.is_primary)?.file_path
      }));
    },
    enabled: !!storefrontId,
  });

  // Filter and sort products
  const filteredAndSortedProducts = products.filter(product => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower)
      );
    }
    if (categoryFilter !== "all") {
      return product.category === categoryFilter;
    }
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "price_asc":
        return (a.price || 0) - (b.price || 0);
      case "price_desc":
        return (b.price || 0) - (a.price || 0);
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${storefrontId}-auth`) === "true";
    setIsVerified(ageVerified && authenticated);
    setIsLoading(false);
  }, [storefrontId]);

  useEffect(() => {
    if (storefront) {
      console.log("Setting page title and favicon for storefront:", storefront);
      document.title = storefront.page_title || storefront.name || "Gallery";

      if (storefront.favicon) {
        const faviconUrl = supabase.storage
          .from("gallery_images")
          .getPublicUrl(storefront.favicon).data.publicUrl;
        
        const existingFavicon = document.querySelector("link[rel='icon']");
        if (existingFavicon) {
          document.head.removeChild(existingFavicon);
        }

        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
      }

      return () => {
        document.title = "Curately - Digital Gallery Platform";
        const existingFavicon = document.querySelector("link[rel='icon']");
        if (existingFavicon) {
          document.head.removeChild(existingFavicon);
        }
        const defaultFavicon = document.createElement("link");
        defaultFavicon.rel = "icon";
        defaultFavicon.href = "/favicon.ico";
        document.head.appendChild(defaultFavicon);
      };
    }
  }, [storefront]);

  const handleVerified = () => {
    localStorage.setItem("age-verified", "true");
    localStorage.setItem(`gallery-${storefrontId}-auth`, "true");
    setIsVerified(true);
  };

  if (isLoading || isStorefrontLoading || isProductsLoading) {
    return <StorefrontLoadingSkeleton />;
  }

  if (storefrontError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while loading the storefront. Please try again later.
          </AlertDescription>
        </Alert>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  if (!storefront) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-xl text-gray-600 mb-4">Storefront not found</div>
        <p className="text-gray-500 mb-6">The storefront you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
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
        <StorefrontProductGrid 
          products={filteredAndSortedProducts}
          accentColor={storefront.accent_color}
        />
      </div>
      {!isVerified && (
        <AgeVerification
          onVerified={handleVerified}
          id={storefrontId as string}
          logo={storefront.logo}
          verificationText={storefront.age_verification_text}
          buttonText={storefront.button_text}
        />
      )}
    </div>
  );
};

export default StorefrontView;