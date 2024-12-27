import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGallery } from "@/hooks/useGallery";
import { AgeVerification } from "@/components/AgeVerification";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const GalleryView = () => {
  const { id } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    gallery, 
    isLoading: isGalleryLoading, 
    error: galleryError,
    deleteImage, 
    refetchGallery 
  } = useGallery(id);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${id}-auth`) === "true";
    
    setIsVerified(ageVerified && authenticated);
    setIsLoading(false);
  }, [id]);

  if (isLoading || isGalleryLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="animate-pulse text-xl text-gray-600 mb-4">Loading gallery...</div>
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (galleryError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while loading the gallery. Please try again later.
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

  if (!gallery) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="text-xl text-gray-600 mb-4">Gallery not found</div>
        <p className="text-gray-500 mb-6">The gallery you're looking for doesn't exist or has been removed.</p>
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
    <>
      {!isVerified && (
        <AgeVerification
          onVerified={() => setIsVerified(true)}
          tenantId={id as string}
          logo={gallery.logo}
        />
      )}
      <GalleryContent
        gallery={gallery}
        galleryId={id as string}
        onDeleteImage={deleteImage}
        onUploadComplete={refetchGallery}
      />
    </>
  );
};

export default GalleryView;