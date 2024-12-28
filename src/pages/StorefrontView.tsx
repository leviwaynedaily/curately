import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStorefront } from "@/hooks/useStorefront";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useProductFiltering } from "@/hooks/useProductFiltering";
import { useStorefrontState } from "@/hooks/useStorefrontState";
import { useStorefrontMetadata } from "@/hooks/useStorefrontMetadata";
import { AgeVerification } from "@/components/AgeVerification";
import { StorefrontContent } from "@/components/storefront/StorefrontContent";
import { StorefrontError } from "@/components/storefront/StorefrontError";
import { StorefrontLoadingSkeleton } from "@/components/storefront/StorefrontLoadingSkeleton";

const StorefrontView = () => {
  const { storefrontId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  const { 
    storefront, 
    isLoading: isStorefrontLoading, 
    error: storefrontError 
  } = useStorefront(storefrontId);

  const {
    isVerified,
    isLoading: isVerificationLoading,
    handleVerified,
    resetVerification
  } = useStorefrontState(storefrontId);

  useStorefrontMetadata(storefront);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError
  } = useStorefrontProducts(storefrontId, isVerified);

  console.log("StorefrontView state:", {
    storefrontId,
    isVerified,
    productsCount: products?.length,
    isLoading: isProductsLoading,
    error: productsError
  });

  const filteredAndSortedProducts = useProductFiltering(
    products,
    searchTerm,
    categoryFilter,
    sortBy
  );

  const categories = Array.from(
    new Set(products.map(p => p.category).filter(Boolean))
  );

  const handleLogoClick = () => {
    console.log("Logo clicked, resetting verification");
    resetVerification();
  };

  if (isVerificationLoading || isStorefrontLoading || isProductsLoading) {
    return <StorefrontLoadingSkeleton />;
  }

  if (storefrontError || productsError) {
    console.error("Error loading storefront:", { storefrontError, productsError });
    return <StorefrontError />;
  }

  if (!storefront) {
    return <StorefrontError isNotFound />;
  }

  // If age verification is enabled and user is not verified, show verification screen
  if (storefront.age_verification_enabled && !isVerified) {
    return (
      <AgeVerification
        onVerified={handleVerified}
        id={storefrontId as string}
        logo={storefront.logo}
        verificationText={storefront.age_verification_text}
        buttonText={storefront.button_text}
        error={error}
        onError={setError}
      />
    );
  }

  return (
    <div className="relative">
      <StorefrontContent
        storefront={storefront}
        products={filteredAndSortedProducts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onLogoClick={handleLogoClick}
      />
    </div>
  );
};

export default StorefrontView;