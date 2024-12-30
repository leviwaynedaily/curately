import { useEffect } from 'react';
import { Storefront } from '@/types/storefront';
import { useManifestGeneration } from './pwa/useManifestGeneration';
import { useMetaTags } from './pwa/useMetaTags';
import { useManifestInjection } from './pwa/useManifestInjection';

export const usePWAConfiguration = (storefront: Storefront | null) => {
  const { generateManifest } = useManifestGeneration(storefront);
  const { updateMetaTags } = useMetaTags();
  const { injectManifest } = useManifestInjection();

  useEffect(() => {
    if (storefront) {
      console.group('PWA Configuration');
      console.log("Starting PWA configuration for storefront:", {
        name: storefront.name,
        screenshots: {
          desktop: storefront.screenshot_desktop,
          mobile: storefront.screenshot_mobile
        }
      });

      const manifest = generateManifest();
      if (!manifest) return;

      const manifestURL = injectManifest(manifest);
      updateMetaTags(manifest);

      console.log("PWA Configuration complete");
      console.groupEnd();

      return () => {
        if (manifestURL) URL.revokeObjectURL(manifestURL);
      };
    }
  }, [storefront]);
};