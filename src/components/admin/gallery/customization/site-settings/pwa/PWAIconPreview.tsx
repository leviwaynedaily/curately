import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type PWAIconPreviewProps = {
  filePath: string;
  size: string;
  onClear: () => void;
};

export const PWAIconPreview = ({ filePath, size, onClear }: PWAIconPreviewProps) => {
  return (
    <div className="relative w-16 h-16">
      <img
        src={supabase.storage.from("gallery_images").getPublicUrl(filePath).data.publicUrl}
        alt={`PWA Icon ${size}x${size}`}
        className="w-full h-full object-contain rounded-lg border"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2"
        onClick={onClear}
        type="button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};