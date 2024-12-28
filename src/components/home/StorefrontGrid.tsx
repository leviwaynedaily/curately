import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Storefront = Database["public"]["Tables"]["storefronts"]["Row"];

const StorefrontGrid = ({ storefronts }: { storefronts: Storefront[] | null }) => {
  if (!storefronts || storefronts.length === 0) return null;

  return (
    <div className="w-full max-w-3xl mx-auto px-2 space-y-1 bounce-in" style={{ animationDelay: '0.7s' }}>
      <h2 className="text-xl font-semibold text-center text-primary/90">Featured Galleries</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {storefronts.map((storefront) => (
          <Link
            key={storefront.id}
            to={`/storefront/${storefront.id}`}
            className="group"
          >
            <div className="aspect-square w-[200px] bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 p-4 flex items-center justify-center">
              {storefront.site_logo ? (
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(storefront.site_logo).data.publicUrl}
                  alt={storefront.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="text-sm font-medium text-primary/80 text-center group-hover:text-primary transition-colors">
                  {storefront.name}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StorefrontGrid;