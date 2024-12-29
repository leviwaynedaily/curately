import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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

  // Update PWA manifest dynamically
  useEffect(() => {
    if (storefront) {
      console.log("Updating PWA manifest for storefront:", storefront.name);

      // Create dynamic manifest
      const manifest = {
        name: storefront.name,
        short_name: storefront.name,
        description: storefront.description || `Welcome to ${storefront.name}`,
        start_url: `/storefront/${storefrontId}`,
        scope: `/storefront/${storefrontId}`,
        display: "standalone",
        background_color: storefront.primary_color || "#ffffff",
        theme_color: storefront.accent_color || "#2A6041",
        icons: [
          storefront.pwa_icon_192 && {
            src: supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          storefront.pwa_icon_512 && {
            src: supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_512).data.publicUrl,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ].filter(Boolean)
      };

      // Create and inject dynamic manifest
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);

      // Remove any existing manifest link
      const existingLink = document.querySelector('link[rel="manifest"]');
      if (existingLink) {
        existingLink.remove();
      }

      // Add new manifest link
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestURL;
      document.head.appendChild(link);

      // Update theme color
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', storefront.accent_color || "#2A6041");

      // Update apple-mobile-web-app-title
      let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
      if (!appleTitleMeta) {
        appleTitleMeta = document.createElement('meta');
        appleTitleMeta.setAttribute('name', 'apple-mobile-web-app-title');
        document.head.appendChild(appleTitleMeta);
      }
      appleTitleMeta.setAttribute('content', storefront.name);

      // Update apple touch icons
      if (storefront.pwa_icon_192) {
        const iconUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl;
        
        // Remove existing apple touch icons
        document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(el => el.remove());
        
        // Add new apple touch icons
        const sizes = ['152x152', '167x167', '180x180', '192x192'];
        sizes.forEach(size => {
          const link = document.createElement('link');
          link.rel = 'apple-touch-icon';
          link.sizes = size;
          link.href = iconUrl;
          document.head.appendChild(link);
        });
      }

      // Cleanup function
      return () => {
        URL.revokeObjectURL(manifestURL);
      };
    }
  }, [storefront, storefrontId]);

  const {
    data: products = [],
    isLoading: isProductsLoading,
    error: productsError
  } = useStorefrontProducts(storefrontId, true);

  console.log("StorefrontView state:", {
    storefrontId,
    isVerified,
    productsCount: products?.length,
    isLoading: isProductsLoading,
    error: productsError,
    products
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

  if (isVerificationLoading || isStorefrontLoading) {
    return <StorefrontLoadingSkeleton />;
  }

  if (storefrontError) {
    console.error("Error loading storefront:", storefrontError);
    return <StorefrontError />;
  }

  if (!storefront) {
    return <StorefrontError isNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className={storefront.age_verification_enabled && !isVerified ? "blur-sm" : ""}>
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
      
      {storefront.age_verification_enabled && !isVerified && (
        <AgeVerification
          onVerified={handleVerified}
          id={storefrontId as string}
          logo={storefront.logo}
          verificationText={storefront.age_verification_text}
          buttonText={storefront.button_text}
          error={error}
          onError={setError}
          instructionsEnabled={storefront.instructions_enabled}
          instructionsContent={storefront.instructions_content}
          instructionsButtonText={storefront.instructions_button_text}
          accentColor={storefront.accent_color}
        />
      )}
    </div>
  );
};

export default StorefrontView;