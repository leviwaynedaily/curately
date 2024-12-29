import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type ScreenshotType = "desktop" | "mobile";

type ScreenshotUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  type: ScreenshotType;
  dimensions: string;
};

export const ScreenshotUploadField = ({ form, type, dimensions }: ScreenshotUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fieldName = `screenshot_${type}` as keyof GalleryFormValues;
  const label = `${type.charAt(0).toUpperCase() + type.slice(1)} Screenshot`;
  const uploadId = `${type}-screenshot-upload`;

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting ${type} screenshot upload...`);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `screenshots/${crypto.randomUUID()}.${fileExt}`;

      console.log(`Uploading ${type} screenshot to storage...`);
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(`Error uploading ${type} screenshot:`, uploadError);
        throw uploadError;
      }

      console.log(`${type} screenshot uploaded successfully, file path:`, filePath);
      
      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true
      });

      toast({ description: `${type} screenshot uploaded successfully` });
    } catch (error) {
      console.error(`${type} screenshot upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : `Failed to upload ${type} screenshot`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearScreenshot = async () => {
    const currentPath = form.getValues(fieldName);
    
    if (currentPath && typeof currentPath === 'string') {
      try {
        const { error: deleteError } = await supabase.storage
          .from("gallery_images")
          .remove([currentPath]);

        if (deleteError) {
          console.error(`Error deleting ${type} screenshot:`, deleteError);
          throw deleteError;
        }

        form.setValue(fieldName, "", { 
          shouldDirty: true,
          shouldTouch: true
        });

        toast({ description: `${type} screenshot removed` });
      } catch (error) {
        console.error(`Error clearing ${type} screenshot:`, error);
        toast({
          variant: "destructive",
          description: `Failed to remove ${type} screenshot`
        });
      }
    }
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {label}
            <span className="text-sm text-muted-foreground font-normal">
              {dimensions}
            </span>
          </FormLabel>
          <div className="space-y-4">
            {field.value ? (
              <div className="relative w-full max-w-md">
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(field.value as string).data.publicUrl}
                  alt={`${type} screenshot`}
                  className="w-full h-auto object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearScreenshot}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <FormControl>
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    onClick={() => document.getElementById(uploadId)?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Screenshot"}
                  </Button>
                  <Input
                    id={uploadId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </FormControl>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};