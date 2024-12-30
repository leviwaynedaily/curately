import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type FileUploadPreviewProps = {
  filePath: string;
  onClear: () => void;
  label: string;
};

export const FileUploadPreview = ({ filePath, onClear, label }: FileUploadPreviewProps) => {
  const imageUrl = supabase.storage
    .from("storefront_products")
    .getPublicUrl(filePath)
    .data.publicUrl;

  return (
    <div className="relative w-40 h-40">
      <img
        src={imageUrl}
        alt={label}
        className="w-full h-full object-contain rounded-lg border"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClear}
        type="button"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};