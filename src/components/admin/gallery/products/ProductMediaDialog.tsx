import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";
import { Product } from "./types";
import { MediaUploadButton } from "./media/MediaUploadButton";
import { MediaGrid } from "./media/MediaGrid";
import { MediaTypeStatus } from "./media/MediaTypeStatus";
import { useProductMedia } from "./media/hooks/useProductMedia";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
    uploadProgress,
    fetchMedia,
    handleFileUpload,
    handleDelete,
    setPrimaryMedia,
  } = useProductMedia(product.id, () => {
    // Call onMediaUpdate after any media changes
    onMediaUpdate();
    fetchMedia();
  });

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      await handleFileUpload(files);
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

          <div className="relative">
            <MediaGrid
              media={media}
              onDelete={handleDelete}
              onSetPrimary={setPrimaryMedia}
            />
            
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm rounded-lg">
                <div className="flex flex-col items-center gap-4 w-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="w-full space-y-2">
                    <Progress value={uploadProgress.percentage} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      Uploading {uploadProgress.current} of {uploadProgress.total} files ({uploadProgress.percentage}%)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};