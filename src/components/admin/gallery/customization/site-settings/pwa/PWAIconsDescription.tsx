export const PWAIconsDescription = () => {
  return (
    <div className="space-y-2 mb-6">
      <h4 className="font-medium">PWA Icons</h4>
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Upload icons for your Progressive Web App (PWA). These icons will be displayed when users install your storefront on their devices.</p>
        <p>Requirements:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>PNG format only</li>
          <li>192×192 icon: Used for app icons on most devices</li>
          <li>512×512 icon: Used for larger displays and high-resolution devices</li>
          <li>Transparent background recommended</li>
          <li>Keep the file size under 1MB for better performance</li>
        </ul>
      </div>
    </div>
  );
};