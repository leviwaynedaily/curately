import { Storefront } from "@/types/storefront";
import { supabase } from "@/integrations/supabase/client";

type StorefrontHeaderProps = {
  storefront: Storefront;
};

export const StorefrontHeader = ({ storefront }: StorefrontHeaderProps) => {
  return (
    <div className="flex justify-center mb-12">
      {storefront.site_logo ? (
        <img
          src={supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl}
          alt={storefront.name}
          className="h-32 object-contain" // Changed from h-16 to h-32
        />
      ) : (
        <h1 className="text-3xl font-bold text-center">{storefront.name}</h1>
      )}
    </div>
  );
};