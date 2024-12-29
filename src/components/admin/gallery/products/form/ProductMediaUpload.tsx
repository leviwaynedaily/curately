import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type ProductMediaUploadProps = {
  previewUrls: string[];
  uploadingMedia: boolean;
  onMediaSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveMedia: (index: number) => void;
};

export const ProductMediaUpload = ({
  previewUrls,
  uploadingMedia,
  onMediaSelect,
  onRemoveMedia,
}: ProductMediaUploadProps) => {
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file sizes and types
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      
      if (!isValidType) {
        toast({
          variant: "destructive",
          description: `${file.name} is not a valid image or video file.`
        });
      }
      
      if (!isValidSize) {
        toast({
          variant: "destructive",
          description: `${file.name} exceeds the 50MB size limit.`
        });
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      onMediaSelect(e);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Media
      </label>
      <div className="grid grid-cols-4 gap-4">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={() => onRemoveMedia(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className={cn(
            "aspect-square flex flex-col items-center justify-center gap-2",
            "border-2 border-dashed",
            uploadingMedia && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => document.getElementById('media-upload')?.click()}
          disabled={uploadingMedia}
        >
          <ImageIcon className="h-6 w-6" />
          <span className="text-xs">Add Media</span>
        </Button>
      </div>
      <Input
        id="media-upload"
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploadingMedia}
      />
      <p className="text-xs text-muted-foreground mt-2">
        Supported formats: Images (JPG, PNG, WebP) and Videos (MP4, WebM). Max file size: 50MB.
        Files will be automatically optimized for web display.
      </p>
    </div>
  );
};