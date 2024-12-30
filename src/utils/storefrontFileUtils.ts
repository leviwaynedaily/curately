export const getStorefrontFilePath = (storefrontId: string, fileType: string, fileExt: string) => {
  console.log("Generating file path:", { storefrontId, fileType, fileExt });
  
  // Settings files (logos, PWA icons, screenshots)
  if (fileType.startsWith('pwa_icon_')) {
    const size = fileType.split('_')[2]; // Extract 192 or 512
    return `${storefrontId}/settings/pwa/icon-${size}.${fileExt}`;
  }
  
  if (fileType === 'screenshot_desktop' || fileType === 'screenshot_mobile') {
    const device = fileType.split('_')[1]; // Extract desktop or mobile
    return `${storefrontId}/settings/screenshots/${device}.${fileExt}`;
  }
  
  if (fileType === 'logo' || fileType === 'site_logo') {
    return `${storefrontId}/settings/logos/${fileType}.${fileExt}`;
  }

  if (fileType === 'favicon') {
    return `${storefrontId}/settings/favicon.${fileExt}`;
  }

  // Default case
  return `${storefrontId}/${fileType}-${crypto.randomUUID()}.${fileExt}`;
};

export const getProductMediaPath = (storefrontId: string, productId: string, fileName: string) => {
  console.log("Generating product media path:", { storefrontId, productId, fileName });
  const fileExt = fileName.split('.').pop();
  const uniqueId = crypto.randomUUID();
  return `${storefrontId}/products/${productId}/${uniqueId}.${fileExt}`;
};