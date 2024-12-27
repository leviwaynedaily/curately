import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PasswordProtection } from "@/components/PasswordProtection";
import { ImageUpload } from "@/components/gallery/ImageUpload";
import { useToast } from "@/components/ui/use-toast";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";
import { GalleryImageGrid } from "@/components/gallery/GalleryImageGrid";
import { GalleryEmptyState } from "@/components/gallery/GalleryEmptyState";

const GalleryView = () => {
  const params = useParams();
  const galleryId = params.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if no id is provided
  useEffect(() => {
    if (!galleryId) {
      console.log("No gallery ID provided, redirecting...");
      navigate("/");
    }
  }, [galleryId, navigate]);

  const { data: gallery, isLoading: isGalleryLoading, error } = useQuery({
    queryKey: ["gallery", galleryId],
    queryFn: async () => {
      if (!galleryId) {
        console.log("No gallery ID provided");
        throw new Error("Gallery ID is required");
      }

      console.log("Fetching gallery details for ID:", galleryId);
      const { data, error } = await supabase
        .from("galleries")
        .select(`
          id,
          name,
          password,
          businesses (
            name
          ),
          gallery_images (
            id,
            file_path,
            title,
            description,
            media_type,
            price,
            is_featured
          )
        `)
        .eq("id", galleryId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }

      if (!data) {
        console.log("No gallery found with ID:", galleryId);
        throw new Error("Gallery not found");
      }

      console.log("Fetched gallery:", data);
      return data;
    },
    enabled: !!galleryId,
  });

  useEffect(() => {
    if (gallery) {
      const authenticated = gallery.password
        ? localStorage.getItem(`gallery-${gallery.id}-auth`) === "true"
        : true;
      setIsAuthenticated(authenticated);
      setIsLoading(false);
    }
  }, [gallery]);

  const handleDeleteImage = async (image: { id: string; filePath: string }) => {
    console.log("Deleting image:", image);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([image.filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);

      if (dbError) {
        console.error("Error deleting from database:", dbError);
        throw dbError;
      }

      console.log("Image deleted successfully");
      toast({ description: "Image deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete image. Please try again.",
      });
    }
  };

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
      <div className="max-w-7xl mx-auto">
        <GalleryHeader name={gallery.name} />
        <ImageUpload
          galleryId={galleryId}
          onUploadComplete={() =>
            queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] })
          }
        />
        {gallery.gallery_images?.length ? (
          <GalleryImageGrid
            images={gallery.gallery_images}
            galleryId={galleryId}
            onDeleteImage={handleDeleteImage}
          />
        ) : (
          <GalleryEmptyState />
        )}
      </div>
    </div>
  );
};

export default GalleryView;