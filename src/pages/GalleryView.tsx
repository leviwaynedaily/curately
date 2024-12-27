import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PasswordProtection } from "@/components/PasswordProtection";
import { useGallery } from "@/hooks/useGallery";
import { useGalleryActions } from "@/hooks/useGalleryActions";
import { GalleryContent } from "@/components/gallery/GalleryContent";

const GalleryView = () => {
  const params = useParams();
  const galleryId = params.id;
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: gallery, isLoading: isGalleryLoading, error } = useGallery(galleryId);
  const { handleDeleteImage, handleUploadComplete } = useGalleryActions(galleryId);

  // Redirect if no id is provided
  useEffect(() => {
    if (!galleryId) {
      console.log("No gallery ID provided, redirecting...");
      navigate("/");
    }
  }, [galleryId, navigate]);

  useEffect(() => {
    if (gallery) {
      const authenticated = gallery.password
        ? localStorage.getItem(`gallery-${gallery.id}-auth`) === "true"
        : true;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    }
  }, [gallery]);

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Failed to load gallery"}
          </p>
        </div>
      </div>
    );
  }

  if (isGalleryLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold">Gallery Not Found</h2>
          <p className="text-muted-foreground">
            The gallery you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (gallery.password && !isAuthenticated) {
    return (
      <PasswordProtection
        tenantId={gallery.id}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <GalleryContent
        gallery={gallery}
        galleryId={galleryId}
        onDeleteImage={handleDeleteImage}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default GalleryView;