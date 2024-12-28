import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStorefront } from "@/hooks/useStorefront";
import { AgeVerification } from "@/components/AgeVerification";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const StorefrontView = () => {
  const { storefrontId } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    storefront, 
    isLoading: isStorefrontLoading, 
    error: storefrontError,
    deleteImage, 
    refetchStorefront 
  } = useStorefront(storefrontId);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${storefrontId}-auth`) === "true";
    
    setIsVerified(ageVerified && authenticated);
    setIsLoading(false);
  }, [storefrontId]);

  useEffect(() => {
    if (storefront) {
      console.log("Setting page title and favicon for storefront:", storefront);
      document.title = storefront.page_title || storefront.name || "Gallery";

      if (storefront.favicon) {
        const faviconUrl = supabase.storage
          .from("gallery_images")
          .getPublicUrl(storefront.favicon).data.publicUrl;
        
        const existingFavicon = document.querySelector("link[rel='icon']");
        if (existingFavicon) {
          document.head.removeChild(existingFavicon);
        }

        const favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
      }

      return () => {
        document.title = "Curately - Digital Gallery Platform";
        const existingFavicon = document.querySelector("link[rel='icon']");
        if (existingFavicon) {
          document.head.removeChild(existingFavicon);
        }
        const defaultFavicon = document.createElement("link");
        defaultFavicon.rel = "icon";
        defaultFavicon.href = "/favicon.ico";
        document.head.appendChild(defaultFavicon);
      };
    }
  }, [storefront]);

  const handleVerified = () => {
    localStorage.setItem("age-verified", "true");
    localStorage.setItem(`gallery-${storefrontId}-auth`, "true");
    setIsVerified(true);
  };

  const handleUploadComplete = async () => {
    await refetchStorefront();
  };

  if (isLoading || isStorefrontLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600 mb-4">Loading storefront...</div>
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (storefrontError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while loading the storefront. Please try again later.
          </AlertDescription>
        </Alert>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  if (!storefront) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-xl text-gray-600 mb-4">Storefront not found</div>
        <p className="text-gray-500 mb-6">The storefront you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <GalleryContent
        gallery={storefront}
        galleryId={storefrontId as string}
        onDeleteImage={deleteImage}
        onUploadComplete={handleUploadComplete}
      />
      {!isVerified && (
        <AgeVerification
          onVerified={handleVerified}
          id={storefrontId as string}
          logo={storefront.logo}
          verificationText={storefront.age_verification_text}
          buttonText={storefront.button_text}
        />
      )}
    </div>
  );
};

export default StorefrontView;