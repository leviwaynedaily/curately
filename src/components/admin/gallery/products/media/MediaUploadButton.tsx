import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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
      className="w-full"
    >
      <Upload className="h-4 w-4 mr-2" />
      {isUploading ? "Uploading..." : "Upload Media"}
    </Button>
  );
};