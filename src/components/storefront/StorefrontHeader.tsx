import { Storefront } from "@/types/storefront";
import { supabase } from "@/integrations/supabase/client";

interface StorefrontHeaderProps {
  storefront: Storefront;
  onLogoClick?: () => void;
  showDescription?: boolean;
}

export const StorefrontHeader = ({ 
  storefront, 
  onLogoClick,
  showDescription = true
}: StorefrontHeaderProps) => {
  const logoUrl = storefront.site_logo
    ? supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl
    : null;

  console.log("StorefrontHeader render:", { 
    showDescription, 
    hasDescription: Boolean(storefront.description),
    description: storefront.description
  });

  return (
    <div className="text-center space-y-4 mb-8">
      {logoUrl ? (
        <div className="flex justify-center">
          <img
            src={logoUrl}
            alt={`${storefront.name} logo`}
            className="h-32 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
            onClick={onLogoClick}
          />
        </div>
      ) : (
        <h1 
          className="text-3xl font-bold"
          style={{ color: storefront.primary_font_color || '#000000' }}
        >
          {storefront.name}
        </h1>
      )}
      {showDescription && storefront.description && storefront.show_description && (
        <p 
          className="text-base max-w-2xl mx-auto"
          style={{ color: storefront.secondary_font_color || '#4B5563' }}
        >
          {storefront.description}
        </p>
      )}
    </div>
  );
};