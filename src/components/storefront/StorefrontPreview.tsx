type StorefrontPreviewProps = {
  storefrontId: string;
};

export const StorefrontPreview = ({ storefrontId }: StorefrontPreviewProps) => {
  console.log("Rendering StorefrontPreview for:", storefrontId);
  
  return (
    <div className="w-full h-full bg-neutral-50 rounded-lg p-4">
      <iframe
        src={`/storefront/${storefrontId}?preview=true`}
        className="w-full h-full rounded border-0"
        title="Storefront Preview"
        key={storefrontId} // Force iframe refresh when ID changes
      />
    </div>
  );
};