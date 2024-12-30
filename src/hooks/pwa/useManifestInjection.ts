export const useManifestInjection = () => {
  const injectManifest = (manifest: any) => {
    // Remove existing manifest link
    const existingLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (existingLink) {
      const oldBlobUrl = existingLink.href;
      existingLink.remove();
      if (oldBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldBlobUrl);
      }
    }

    // Create and inject new manifest
    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(manifestBlob);
    
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = manifestURL;
    document.head.appendChild(link);

    return manifestURL;
  };

  return { injectManifest };
};