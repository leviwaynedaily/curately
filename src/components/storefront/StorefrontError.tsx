import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Home, AlertCircle } from "lucide-react";

type StorefrontErrorProps = {
  isNotFound?: boolean;
};

export const StorefrontError = ({ isNotFound }: StorefrontErrorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {isNotFound ? (
        <>
          <div className="text-xl text-gray-600 mb-4">Storefront not found</div>
          <p className="text-gray-500 mb-6">
            The storefront you're looking for doesn't exist or has been removed.
          </p>
        </>
      ) : (
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while loading the storefront. Please try again later.
          </AlertDescription>
        </Alert>
      )}
      <Link to="/">
        <Button variant="outline" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Return Home
        </Button>
      </Link>
    </div>
  );
};