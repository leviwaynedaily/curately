import { supabase } from "@/integrations/supabase/client";
import { Storefront } from "@/types/storefront";

type StorefrontHeaderProps = {
  storefront: Storefront;
};

export const StorefrontHeader = ({ storefront }: StorefrontHeaderProps) => {
  console.log("Rendering StorefrontHeader with logo:", storefront.site_logo);
  
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    return supabase.storage
      .from("gallery_images")
      .getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="flex justify-center mb-12">
      {storefront.site_logo ? (
        <img
          src={getImageUrl(storefront.site_logo)}
          alt={storefront.name}
          className="h-48 object-contain"
        />
      ) : (
        <h1 className="text-3xl font-bold text-center">{storefront.name}</h1>
      )}
    </div>
  );
};