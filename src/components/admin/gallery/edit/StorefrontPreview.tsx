type StorefrontPreviewProps = {
  storefrontId: string;
};

export const StorefrontPreview = ({ storefrontId }: StorefrontPreviewProps) => {
  return (
    <div className="w-full h-full bg-neutral-50 rounded-lg p-4">
      <iframe
        src={`/storefront/${storefrontId}`}
        className="w-full h-full rounded border-0"
        title="Storefront Preview"
      />
    </div>
  );
};