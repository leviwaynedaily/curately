import { useEffect } from 'react';
import { Storefront } from '@/types/storefront';
import { supabase } from '@/integrations/supabase/client';

export const usePWAConfiguration = (storefront: Storefront | null) => {
  useEffect(() => {
    if (storefront) {
      console.log("Configuring PWA for storefront:", {
        name: storefront.name,
        pwa_icon_192: storefront.pwa_icon_192,
        pwa_icon_512: storefront.pwa_icon_512
      });
      
      // Create array of icons, filtering out undefined ones
      const icons = [];
      const baseUrl = 'https://www.curately.shop';
      const storefrontPath = `/storefront/${storefront.id}`;
      
      if (storefront.pwa_icon_192) {
        const icon192Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl;
        console.log("Adding 192x192 icon:", {
          path: storefront.pwa_icon_192,
          url: icon192Url
        });
        
        icons.push({
          src: icon192Url,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        });
      }
      
      if (storefront.pwa_icon_512) {
        const icon512Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_512).data.publicUrl;
        console.log("Adding 512x512 icon:", {
          path: storefront.pwa_icon_512,
          url: icon512Url
        });
        
        icons.push({
          src: icon512Url,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        });
      }

      console.log("Final PWA Icons configuration:", {
        totalIcons: icons.length,
        icons: icons
      });

      // Create dynamic manifest
      const manifest = {
        name: storefront.name,
        short_name: storefront.name,
        description: storefront.description || `Welcome to ${storefront.name}`,
        start_url: `${baseUrl}${storefrontPath}`,
        scope: `${baseUrl}${storefrontPath}`,
        display: "standalone",
        background_color: storefront.primary_color || "#ffffff",
        theme_color: storefront.accent_color || "#2A6041",
        icons: icons
      };

      console.log("Generated manifest:", manifest);

      // Create and inject dynamic manifest
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);

      // Remove any existing manifest link
      const existingLink = document.querySelector('link[rel="manifest"]');
      if (existingLink) {
        existingLink.remove();
        console.log("Removed existing manifest link");
      }

      // Add new manifest link
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = manifestURL;
      document.head.appendChild(link);
      console.log("Added new manifest link:", manifestURL);

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

      // Update apple touch icons if available
      if (storefront.pwa_icon_192) {
        const iconUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl;
        console.log("Setting Apple touch icon URL:", iconUrl);
        
        // Create array of sizes for apple touch icons
        const appleSizes = ['152', '167', '180', '192'];
        
        // Remove existing apple touch icons
        document.querySelectorAll('link[rel="apple-touch-icon"]').forEach(el => el.remove());
        console.log("Removed existing Apple touch icons");
        
        // Add new apple touch icons
        appleSizes.forEach(size => {
          const appleLink = document.createElement('link');
          appleLink.setAttribute('rel', 'apple-touch-icon');
          appleLink.setAttribute('sizes', `${size}x${size}`);
          appleLink.setAttribute('href', iconUrl);
          document.head.appendChild(appleLink);
          console.log(`Added Apple touch icon for size ${size}x${size}`);
        });
      }

      // Cleanup function
      return () => {
        URL.revokeObjectURL(manifestURL);
        console.log("Cleaned up manifest URL");
      };
    }
  }, [storefront]);
};