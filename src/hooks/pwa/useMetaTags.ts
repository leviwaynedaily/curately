import { supabase } from '@/integrations/supabase/client';

export const useMetaTags = () => {
  const updateMetaTags = (manifest: any) => {
    if (!manifest) return;

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

    // Add apple-mobile-web-app-capable
    let appleCapableMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!appleCapableMeta) {
      appleCapableMeta = document.createElement('meta');
      appleCapableMeta.setAttribute('name', 'apple-mobile-web-app-capable');
      document.head.appendChild(appleCapableMeta);
    }
    appleCapableMeta.setAttribute('content', 'yes');

    console.log("Updated meta tags with manifest data:", { 
      theme_color: manifest.theme_color,
      name: manifest.name,
      screenshots: manifest.screenshots?.length || 0
    });
  };

  return { updateMetaTags };
};