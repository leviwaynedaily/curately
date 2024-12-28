import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Image as ImageIcon, Video, X } from "lucide-react";
import { Product } from "./types";

type ProductMediaDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onMediaUpdate: () => void;
};

export const ProductMediaDialog = ({
  isOpen,
  onClose,
  product,
  onMediaUpdate,
}: ProductMediaDialogProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [media, setMedia] = useState<Array<{ id: string; file_path: string; media_type: string; is_primary: boolean }>>([]);

  const fetchMedia = async () => {
    console.log("Fetching media for product:", product.id);
    const { data, error } = await supabase
      .from("product_media")
      .select("*")
      .eq("product_id", product.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching product media:", error);
      return;
    }

    console.log("Fetched product media:", data);
    setMedia(data);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Starting media upload for product:", product.id);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${product.id}/${crypto.randomUUID()}.${fileExt}`;
      const mediaType = file.type.startsWith("video/") ? "video" : "image";

      console.log("Uploading file to storage...");
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw uploadError;
      }

      console.log("Creating media record...");
      const { error: dbError } = await supabase.from("product_media").insert({
        product_id: product.id,
        file_path: filePath,
        media_type: mediaType,
        is_primary: media.length === 0, // First uploaded media is primary
        title: file.name,
      });

      if (dbError) {
        console.error("Error creating media record:", dbError);
        throw dbError;
      }

      toast({ description: "Media uploaded successfully" });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Media upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload media. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: string, filePath: string) => {
    try {
      console.log("Deleting media:", mediaId);
      const { error: dbError } = await supabase
        .from("product_media")
        .delete()
        .eq("id", mediaId);

      if (dbError) throw dbError;

      const { error: storageError } = await supabase.storage
        .from("gallery_images")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }

      toast({ description: "Media deleted successfully" });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete media",
      });
    }
  };

  const setPrimaryMedia = async (mediaId: string) => {
    try {
      console.log("Setting primary media:", mediaId);
      // First, unset all primary media for this product
      await supabase
        .from("product_media")
        .update({ is_primary: false })
        .eq("product_id", product.id);

      // Then set the selected media as primary
      const { error } = await supabase
        .from("product_media")
        .update({ is_primary: true })
        .eq("id", mediaId);

      if (error) throw error;

      toast({ description: "Primary media updated" });
      fetchMedia();
      onMediaUpdate();
    } catch (error) {
      console.error("Error updating primary media:", error);
      toast({
        variant: "destructive",
        description: "Failed to update primary media",
      });
    }
  };

  // Fetch media when dialog opens
  useState(() => {
    if (isOpen) {
      fetchMedia();
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Product Media - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Button
            variant="outline"
            disabled={isUploading}
            onClick={() => document.getElementById("media-upload")?.click()}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Upload Media"}
          </Button>
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="relative group">
                {item.media_type === "video" ? (
                  <video
                    src={supabase.storage.from("gallery_images").getPublicUrl(item.file_path).data.publicUrl}
                    className="w-full aspect-square object-cover rounded-lg"
                    controls
                  />
                ) : (
                  <img
                    src={supabase.storage.from("gallery_images").getPublicUrl(item.file_path).data.publicUrl}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.file_path)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  {item.media_type === "video" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                  <Button
                    variant={item.is_primary ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setPrimaryMedia(item.id)}
                  >
                    {item.is_primary ? "Primary" : "Set as Primary"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};