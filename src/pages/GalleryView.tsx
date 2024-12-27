import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGallery } from "@/hooks/useGallery";
import { AgeVerification } from "@/components/AgeVerification";
import { PasswordProtection } from "@/components/PasswordProtection";
import { GalleryContent } from "@/components/gallery/GalleryContent";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const GalleryView = () => {
  const { id } = useParams();
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { gallery, isLoading: isGalleryLoading, deleteImage, refetchGallery } = useGallery(id as string);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${id}-auth`) === "true";
    
    setIsAgeVerified(ageVerified);
    setIsAuthenticated(authenticated);
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

  if (!isAgeVerified) {
    return <AgeVerification onVerified={() => setIsAgeVerified(true)} logo={gallery.logo} />;
  }

  if (!isAuthenticated && gallery.password) {
    return (
      <PasswordProtection
        tenantId={id as string}
        onAuthenticated={() => setIsAuthenticated(true)}
        logo={gallery.logo}
      />
    );
  }

  return (
    <GalleryContent
      gallery={gallery}
      galleryId={id as string}
      onDeleteImage={deleteImage}
      onUploadComplete={refetchGallery}
    />
  );
};

export default GalleryView;