import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";

type MediaUploadButtonProps = {
  isUploading: boolean;
  onClick: () => void;
};

export const MediaUploadButton = ({ isUploading, onClick }: MediaUploadButtonProps) => {
  return (
    <Button
      variant="outline"
      disabled={isUploading}
      onClick={onClick}
      className="w-full relative"
    >
      {isUploading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-2" />
          Upload Media
        </>
      )}
    </Button>
  );
};