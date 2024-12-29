export const getStorefrontFilePath = (storefrontId: string, fileType: string, fileExt: string) => {
  const fileTypes = {
    site_logo: 'site-logo',
    logo: 'verification-logo',
    pwa_icon_192: 'pwa-192',
    pwa_icon_512: 'pwa-512',
    screenshot_desktop: 'screenshot-desktop',
    screenshot_mobile: 'screenshot-mobile',
    favicon: 'favicon'
  };

  const type = fileTypes[fileType as keyof typeof fileTypes];
  if (!type) {
    throw new Error(`Invalid file type: ${fileType}`);
  }

  return `${storefrontId}/${type}.${fileExt}`;
};