import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";
import { Product } from "./types";
import { MediaUploadButton } from "./media/MediaUploadButton";
import { MediaGrid } from "./media/MediaGrid";
import { MediaTypeStatus } from "./media/MediaTypeStatus";
import { useProductMedia } from "./media/hooks/useProductMedia";

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
  const {
    media,
    isLoading,
    fetchMedia,
    handleFileUpload,
    handleDelete,
    setPrimaryMedia,
  } = useProductMedia(product.id, onMediaUpdate);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
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
              isUploading={isLoading}
              onClick={() => document.getElementById("media-upload")?.click()}
            />
          </div>
          
          <input
            id="media-upload"
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleInputChange}
            disabled={isLoading}
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