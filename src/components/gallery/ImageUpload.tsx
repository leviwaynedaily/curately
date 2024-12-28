import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ImageUploadProps = {
  galleryId: string;
  onUploadComplete: () => void;
};

export const ImageUpload = ({ galleryId, onUploadComplete }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Starting file upload...");

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${galleryId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading file to storage...");
      const { error: uploadError } = await supabase.storage
        .from("product_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      console.log("Creating database record...");
      const { error: dbError } = await supabase.from("product_media").insert({
        file_path: filePath,
        title: file.name,
      });

      if (dbError) throw dbError;

      console.log("Upload completed successfully");
      toast({ description: "Image uploaded successfully" });
      onUploadComplete();
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Button
        variant="outline"
        disabled={isUploading}
        className="relative"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload className="h-4 w-4 mr-2" />
        {isUploading ? "Uploading..." : "Upload Image"}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </Button>
    </div>
  );
};