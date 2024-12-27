import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";

const GalleryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: gallery, isLoading } = useQuery({
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

  if (isLoading) {
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

        {gallery?.gallery_images?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.gallery_images.map((image) => (
              <div
                key={image.id}
                className="aspect-square bg-muted rounded-lg overflow-hidden"
              >
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/gallery_images/${
                    image.file_path
                  }`}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No images in this gallery</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryView;