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

  const headerStyle = {
    backgroundColor: gallery.primary_color || '#141413',
    color: gallery.secondary_color || '#E6E4DD',
  };

  const containerStyle = {
    backgroundColor: gallery.secondary_color || '#E6E4DD',
    color: gallery.primary_color || '#141413',
  };

  // Get the logo URL
  const displayLogo = gallery.site_logo || gallery.logo;
  const logoUrl = displayLogo
    ? supabase.storage.from("gallery_images").getPublicUrl(displayLogo).data.publicUrl
    : null;

  console.log('Gallery content display logo:', displayLogo);
  console.log('Gallery content logo URL:', logoUrl);
  console.log('Gallery site_logo:', gallery.site_logo);
  console.log('Gallery logo:', gallery.logo);

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
              className="h-32 object-contain rounded-lg transition-all duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-32 w-full max-w-sm bg-accent/5 rounded-lg flex items-center justify-center border-2 border-accent/10">
              <span className="text-accent text-xl font-medium opacity-50">No Logo</span>
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