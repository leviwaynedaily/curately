import { Storefront } from '@/types/storefront';
import { supabase } from '@/integrations/supabase/client';

export const useMetaTags = () => {
  const updateMetaTags = (manifest: any) => {
    // Update theme color
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute('content', manifest.theme_color);

    // Update apple-mobile-web-app-title
    let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (!appleTitleMeta) {
      appleTitleMeta = document.createElement('meta');
      appleTitleMeta.setAttribute('name', 'apple-mobile-web-app-title');
      document.head.appendChild(appleTitleMeta);
    }
    appleTitleMeta.setAttribute('content', manifest.name);
  };

  return { updateMetaTags };
};