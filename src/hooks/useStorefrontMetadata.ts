import { Storefront } from "@/types/storefront";
import { useEffect } from "react";

export const useStorefrontMetadata = (storefront: Storefront | null) => {
  useEffect(() => {
    if (storefront) {
      // Update page title
      document.title = storefront.page_title || `${storefront.name} | Curately.shop`;

      // Update favicon if set
      if (storefront.favicon) {
        const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (link) {
          link.href = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${storefront.favicon}`;
        }
      }

      // Update meta tags
      const metaTags = [
        {
          property: "og:title",
          content: storefront.page_title || `${storefront.name} | Curately.shop`,
        },
        {
          property: "og:description",
          content: storefront.description || `Visit ${storefront.name} on Curately.shop`,
        },
        {
          property: "og:image",
          content: storefront.site_logo
            ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${storefront.site_logo}`
            : "https://curately.shop/og-image.png",
        },
        {
          property: "og:url",
          content: `https://curately.shop/storefront/${storefront.id}`,
        },
        {
          name: "description",
          content: storefront.description || `Visit ${storefront.name} on Curately.shop`,
        },
      ];

      // Update or create meta tags
      metaTags.forEach(({ property, name, content }) => {
        let meta = document.querySelector(
          property
            ? `meta[property="${property}"]`
            : `meta[name="${name}"]`
        ) as HTMLMetaElement;

        if (!meta) {
          meta = document.createElement("meta");
          if (property) {
            meta.setAttribute("property", property);
          }
          if (name) {
            meta.setAttribute("name", name);
          }
          document.head.appendChild(meta);
        }

        meta.setAttribute("content", content);
      });
    }
  }, [storefront]);
};