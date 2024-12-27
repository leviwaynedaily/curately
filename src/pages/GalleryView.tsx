import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGallery } from "@/hooks/useGallery";
import { AgeVerification } from "@/components/AgeVerification";
import { PasswordProtection } from "@/components/PasswordProtection";
import { GalleryContent } from "@/components/gallery/GalleryContent";

const GalleryView = () => {
  const { id } = useParams();
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { gallery, isGalleryLoading, deleteImage, refetchGallery } = useGallery(id as string);

  useEffect(() => {
    const ageVerified = localStorage.getItem("age-verified") === "true";
    const authenticated = localStorage.getItem(`gallery-${id}-auth`) === "true";
    
    setIsAgeVerified(ageVerified);
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, [id]);

  if (isLoading || isGalleryLoading || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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