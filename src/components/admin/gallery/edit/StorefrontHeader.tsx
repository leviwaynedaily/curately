type StorefrontHeaderProps = {
  storefront: {
    name: string;
    businesses?: {
      name: string;
    } | null;
  };
};

export const StorefrontHeader = ({ storefront }: StorefrontHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{storefront.name}</h1>
        </div>
        {storefront.businesses?.name && (
          <p className="text-sm text-muted-foreground">
            Business: {storefront.businesses.name}
          </p>
        )}
      </div>
    </div>
  );
};