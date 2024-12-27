import { Gallery } from "@/types/gallery";
import { ImageUpload } from "./ImageUpload";
import { GalleryImageGrid } from "./GalleryImageGrid";
import { GalleryEmptyState } from "./GalleryEmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type GalleryContentProps = {
  gallery: Gallery;
  galleryId: string;
  onDeleteImage: (image: { id: string; filePath: string }) => void;
  onUploadComplete: () => void;
};

export const GalleryContent = ({
  gallery,
  galleryId,
  onDeleteImage,
  onUploadComplete,
}: GalleryContentProps) => {
  const { session } = useAuth();
  
  // Query to check if user has admin access to this gallery
  const { data: hasAccess } = useQuery({
    queryKey: ["galleryAccess", galleryId, session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return false;
      
      const { data } = await supabase
        .from("galleries")
        .select("businesses(owner_id)")
        .eq("id", galleryId)
        .single();
      
      return data?.businesses?.owner_id === session?.user?.id;
    },
    enabled: !!session?.user?.id,
  });

  // Create dynamic styles based on gallery settings
  const headerStyle = {
    backgroundColor: gallery.primary_color || '#141413',
    color: gallery.secondary_color || '#E6E4DD',
  };

  const containerStyle = {
    backgroundColor: gallery.secondary_color || '#E6E4DD',
    color: gallery.primary_color || '#141413',
  };

  // Get the public URL for the logo
  const logoUrl = gallery.logo 
    ? supabase.storage.from('gallery_images').getPublicUrl(gallery.logo).data.publicUrl
    : null;

  console.log('Gallery logo path:', gallery.logo);
  console.log('Constructed logo URL:', logoUrl);

  return (
    <div style={containerStyle} className="min-h-screen">
      <div 
        style={headerStyle}
        className="py-8 px-4 mb-8 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={gallery.name}
              className="h-24 object-contain rounded-lg"
            />
          ) : (
            <div className="h-24 w-full max-w-xs bg-accent/10 rounded-lg flex items-center justify-center">
              <span className="text-accent text-lg opacity-50">No Logo</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4">
        {hasAccess && (
          <ImageUpload
            galleryId={galleryId}
            onUploadComplete={onUploadComplete}
          />
        )}
        {gallery.gallery_images?.length ? (
          <GalleryImageGrid
            images={gallery.gallery_images}
            galleryId={galleryId}
            onDeleteImage={onDeleteImage}
            accentColor={gallery.accent_color}
            isAdmin={!!hasAccess}
          />
        ) : (
          <GalleryEmptyState />
        )}
      </div>
    </div>
  );
};