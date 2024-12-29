import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type StorefrontHeaderProps = {
  storefront: {
    name: string;
    businesses?: {
      name: string;
    } | null;
  };
};

export const StorefrontHeader = ({ storefront }: StorefrontHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
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