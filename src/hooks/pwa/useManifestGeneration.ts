import { Storefront } from '@/types/storefront';
import { supabase } from '@/integrations/supabase/client';

export const useManifestGeneration = (storefront: Storefront | null) => {
  const generateManifest = () => {
    if (!storefront) return null;

    const icons = [];
    const screenshots = [];
    
    // Add icons
    if (storefront.pwa_icon_192) {
      try {
        const icon192Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_192).data.publicUrl;
        icons.push({
          src: icon192Url,
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable"
        });
      } catch (error) {
        console.error("Error processing PWA icon 192:", error);
      }
    }
    
    if (storefront.pwa_icon_512) {
      try {
        const icon512Url = supabase.storage.from("gallery_images").getPublicUrl(storefront.pwa_icon_512).data.publicUrl;
        icons.push({
          src: icon512Url,
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        });
      } catch (error) {
        console.error("Error processing PWA icon 512:", error);
      }
    }

    // Add screenshots
    if (storefront.screenshot_desktop) {
      try {
        console.log("Processing desktop screenshot:", storefront.screenshot_desktop);
        const desktopUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.screenshot_desktop).data.publicUrl;
        screenshots.push({
          src: desktopUrl,
          sizes: "1920x1080",
          type: "image/png",
          form_factor: "wide",
          label: "Desktop view"
        });
      } catch (error) {
        console.error("Error processing desktop screenshot:", error);
      }
    }
    
    if (storefront.screenshot_mobile) {
      try {
        console.log("Processing mobile screenshot:", storefront.screenshot_mobile);
        const mobileUrl = supabase.storage.from("gallery_images").getPublicUrl(storefront.screenshot_mobile).data.publicUrl;
        screenshots.push({
          src: mobileUrl,
          sizes: "390x844",
          type: "image/png",
          form_factor: "narrow",
          label: "Mobile view"
        });
      } catch (error) {
        console.error("Error processing mobile screenshot:", error);
      }
    }

    const baseUrl = window.location.origin;
    const storefrontPath = `/storefront/${storefront.id}`;
    const fullStorefrontUrl = `${baseUrl}${storefrontPath}`;

    console.log("Generated manifest with screenshots:", { screenshots });

    return {
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
  };

  return { generateManifest };
};