import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "./types";
import { MediaUploadButton } from "./media/MediaUploadButton";
import { MediaGrid } from "./media/MediaGrid";
import { MediaTypeStatus } from "./media/MediaTypeStatus";

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
      // First upload the file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${product.id}/${crypto.randomUUID()}.${fileExt}`;
      const mediaType = file.type.startsWith("video/") ? "video" : "image";

      console.log("Uploading file to storage...");
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Then create the media record with the product_id
      console.log("Creating media record with product_id:", product.id);
      const { error: dbError } = await supabase
        .from("product_media")
        .insert([{
          product_id: product.id,
          file_path: filePath,
          media_type: mediaType,
          is_primary: media.length === 0,
          title: file.name,
        }]);

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
      // First, set all media for this product to non-primary
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
  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, product.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Product Media - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <MediaTypeStatus media={media} />
            <MediaUploadButton
              isUploading={isUploading}
              onClick={() => document.getElementById("media-upload")?.click()}
            />
          </div>
          
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />

          <MediaGrid
            media={media}
            onDelete={handleDelete}
            onSetPrimary={setPrimaryMedia}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};