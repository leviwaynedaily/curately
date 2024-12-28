import { useEffect } from "react";
import { Storefront } from "@/types/storefront";
import { supabase } from "@/integrations/supabase/client";

export const useStorefrontMetadata = (storefront: Storefront | null) => {
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
};