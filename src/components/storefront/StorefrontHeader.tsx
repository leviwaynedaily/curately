import { Storefront } from "@/types/storefront";
import { supabase } from "@/integrations/supabase/client";

interface StorefrontHeaderProps {
  storefront: Storefront;
  onLogoClick?: () => void;
  showDescription?: boolean;
  compact?: boolean;
}

export const StorefrontHeader = ({ 
  storefront, 
  onLogoClick,
  showDescription = true,
  compact = false
}: StorefrontHeaderProps) => {
  console.log("StorefrontHeader render:", { 
    storefront,
    showDescription,
    hasDescription: Boolean(storefront.description),
    show_description: storefront.show_description,
    description: storefront.description,
    compact
  });

  const logoUrl = storefront.site_logo
    ? supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl
    : null;

  return (
    <div className={`text-center space-y-2 ${compact ? 'mb-0' : 'mb-8'}`}>
      {logoUrl ? (
        <div className="flex justify-center">
          <img
            src={logoUrl}
            alt={`${storefront.name} logo`}
            className={`object-contain cursor-pointer hover:opacity-90 transition-opacity ${
              compact ? 'h-12' : 'h-32'
            }`}
            onClick={onLogoClick}
          />
        </div>
      ) : (
        <h1 
          className={`font-bold ${compact ? 'text-xl' : 'text-3xl'}`}
          style={{ color: storefront.primary_font_color }}
        >
          {storefront.name}
        </h1>
      )}
      
      {!compact && storefront.show_description && storefront.description && (
        <p 
          className="text-base max-w-2xl mx-auto"
          style={{ color: storefront.secondary_font_color }}
        >
          {storefront.description}
        </p>
      )}
    </div>
  );
};