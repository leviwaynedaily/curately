import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

type PWAIconUploadButtonProps = {
  isUploading: boolean;
  uploadId: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PWAIconUploadButton = ({
  isUploading,
  uploadId,
  onFileSelect,
}: PWAIconUploadButtonProps) => {
  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isUploading}
        onClick={() => document.getElementById(uploadId)?.click()}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Icon"}
      </Button>
      <Input
        id={uploadId}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={onFileSelect}
        disabled={isUploading}
      />
    </div>
  );
};