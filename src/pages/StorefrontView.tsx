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
  } = useStorefrontState(storefrontId);

  useStorefrontMetadata(storefront);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError
  } = useStorefrontProducts(storefrontId, isVerified);

  console.log("Products loading state:", {
    isProductsLoading,
    productsCount: products?.length,
    storefrontId,
    isVerified
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

  if (isVerificationLoading || isStorefrontLoading || isProductsLoading) {
    return <StorefrontLoadingSkeleton />;
  }

  if (storefrontError || productsError) {
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

  // If verification passed or not required, show storefront content
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
      />
    </div>
  );
};

export default StorefrontView;