import { useEffect } from 'react';
import { Storefront } from '@/types/storefront';
import { supabase } from '@/integrations/supabase/client';

export const usePWAConfiguration = (storefront: Storefront | null) => {
  useEffect(() => {
    if (storefront) {
      console.group('PWA Configuration');
      console.log("Starting PWA configuration for storefront:", {
        name: storefront.name,
        pwa_icon_192: storefront.pwa_icon_192,
        pwa_icon_512: storefront.pwa_icon_512,
        screenshots: {
          desktop: storefront.screenshot_desktop,
          mobile: storefront.screenshot_mobile
        }
      });
      
      // Create array of icons, filtering out undefined ones
      const icons = [];
      
      if (storefront.pwa_icon_192) {
        const icon192Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl;
        console.log("Adding 192x192 icon:", {
          path: storefront.pwa_icon_192,
          fullUrl: icon192Url
        });
        
        icons.push({
          src: icon192Url,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        });
      } else {
        console.warn("No 192x192 PWA icon found in storefront configuration");
      }
      
      if (storefront.pwa_icon_512) {
        const icon512Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_512).data.publicUrl;
        console.log("Adding 512x512 icon:", {
          path: storefront.pwa_icon_512,
          fullUrl: icon512Url
        });
        
        icons.push({
          src: icon512Url,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        });
      } else {
        console.warn("No 512x512 PWA icon found in storefront configuration");
      }

      // Create array of screenshots
      const screenshots = [];
      
      if (storefront.screenshot_desktop) {
        const desktopUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.screenshot_desktop).data.publicUrl;
        console.log("Adding desktop screenshot:", {
          path: storefront.screenshot_desktop,
          fullUrl: desktopUrl
        });
        
        screenshots.push({
          src: desktopUrl,
          sizes: "1920x1080",
          type: "image/png",
          form_factor: "wide",
          label: "Desktop view"
        });
      } else {
        console.warn("No desktop screenshot found in storefront configuration");
      }
      
      if (storefront.screenshot_mobile) {
        const mobileUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.screenshot_mobile).data.publicUrl;
        console.log("Adding mobile screenshot:", {
          path: storefront.screenshot_mobile,
          fullUrl: mobileUrl
        });
        
        screenshots.push({
          src: mobileUrl,
          sizes: "390x844",
          type: "image/png",
          form_factor: "narrow",
          label: "Mobile view"
        });
      } else {
        console.warn("No mobile screenshot found in storefront configuration");
      }

      // Get the base URL for the site
      const baseUrl = window.location.origin;
      const storefrontPath = `/storefront/${storefront.id}`;
      const fullStorefrontUrl = `${baseUrl}${storefrontPath}`;

      // Create dynamic manifest with proper start_url and id
      const manifest = {
        name: storefront.name,
        short_name: storefront.name,
        description: storefront.description || `Welcome to ${storefront.name}`,
        id: storefrontPath,
        start_url: fullStorefrontUrl,
        scope: fullStorefrontUrl,
        display: "standalone",
        background_color: storefront.primary_color || "#FFFFFF",
        theme_color: storefront.accent_color || "#2A6041",
        icons,
        screenshots
      };

      console.log("Generated manifest:", manifest);
      console.log("Icons array length:", icons.length);
      console.log("Screenshots array length:", screenshots.length);
      console.log("Final icons configuration:", icons);
      console.log("Final screenshots configuration:", screenshots);

      // Remove any existing manifest link and clean up old Blob URL
      const existingLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
      if (existingLink) {
        const oldBlobUrl = existingLink.href;
        existingLink.remove();
        if (oldBlobUrl.startsWith('blob:')) {
          URL.revokeObjectURL(oldBlobUrl);
        }
        console.log("Removed existing manifest link");
      }

      // Create and inject dynamic manifest
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      console.log("Created new manifest blob URL:", manifestURL);
      console.log("Manifest content:", JSON.stringify(manifest, null, 2));

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

      console.groupEnd();

      // Cleanup function
      return () => {
        URL.revokeObjectURL(manifestURL);
        console.log("Cleaned up manifest URL");
      };
    }
  }, [storefront]); // Re-run when storefront changes
};