import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon, Trash2 } from "lucide-react";
import { PasswordProtection } from "@/components/PasswordProtection";
import { ImageUpload } from "@/components/gallery/ImageUpload";
import { ImageDeleteDialog } from "@/components/gallery/ImageDeleteDialog";
import { useToast } from "@/components/ui/use-toast";

const GalleryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; filePath: string } | null>(null);

  const { data: gallery, isLoading: isGalleryLoading } = useQuery({
    queryKey: ["gallery", id],
    queryFn: async () => {
      console.log("Fetching gallery details...");
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
            description
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching gallery:", error);
        throw error;
      }

      console.log("Fetched gallery:", data);
      return data;
    },
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

  const handleUploadComplete = () => {
    queryClient.invalidateQueries({ queryKey: ["gallery", id] });
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    console.log("Deleting image:", imageToDelete);
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([imageToDelete.filePath]);

      if (storageError) {
        console.error("Error deleting from storage:", storageError);
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", imageToDelete.id);

      if (dbError) {
        console.error("Error deleting from database:", dbError);
        throw dbError;
      }

      console.log("Image deleted successfully");
      toast({ description: "Image deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["gallery", id] });
    } catch (error) {
      console.error("Delete failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete image. Please try again.",
      });
    } finally {
      setImageToDelete(null);
    }
  };

  if (isGalleryLoading || isLoading) {
    return (
      <div className="min-h-screen bg-primary text-secondary p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (gallery?.password && !isAuthenticated) {
    return (
      <PasswordProtection
        tenantId={gallery.id}
        onAuthenticated={() => setIsAuthenticated(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-primary text-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-secondary"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-4xl font-bold">{gallery?.name}</h1>
        </div>

        <ImageUpload galleryId={id!} onUploadComplete={handleUploadComplete} />

        {gallery?.gallery_images?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.gallery_images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${
                    image.file_path
                  }`}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setImageToDelete({ id: image.id, filePath: image.file_path })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No images in this gallery</p>
          </div>
        )}

        <ImageDeleteDialog
          isOpen={!!imageToDelete}
          onClose={() => setImageToDelete(null)}
          onConfirm={handleDeleteImage}
        />
      </div>
    </div>
  );
};

export default GalleryView;