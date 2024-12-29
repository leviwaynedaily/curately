import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";
import { PWAIconPreview } from "./PWAIconPreview";
import { PWAIconUploadButton } from "./PWAIconUploadButton";

type PWAIconUploadFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
  size: "192" | "512";
};

export const PWAIconUploadField = ({ form, size }: PWAIconUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fieldName = `pwa_icon_${size}` as keyof GalleryFormValues;
  const uploadId = `pwa-icon-${size}-upload`;

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting PWA icon ${size}x${size} upload...`, { file });

    try {
      if (!file.type.includes('png')) {
        throw new Error('Please upload a PNG file');
      }

      const storefrontId = form.getValues("id");
      if (!storefrontId) {
        throw new Error("Storefront ID is required");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = getStorefrontFilePath(storefrontId, `pwa_icon_${size}`, fileExt || 'png');

      console.log(`Uploading ${size}x${size} icon to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error(`Error uploading ${size}x${size} PWA icon:`, uploadError);
        throw uploadError;
      }

      console.log(`${size}x${size} icon uploaded successfully`);

      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      toast({ description: `${size}x${size} PWA icon uploaded successfully` });
    } catch (error) {
      console.error(`PWA icon ${size}x${size} upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to upload PWA icon",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearIcon = () => {
    console.log(`Clearing ${size}x${size} PWA icon`);
    form.setValue(fieldName, "", { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            {`PWA Icon ${size}×${size}`}
            <span className="text-sm text-muted-foreground font-normal">
              (PNG only)
            </span>
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
              {field.value ? (
                <PWAIconPreview 
                  filePath={field.value} 
                  size={size} 
                  onClear={clearIcon}
                />
              ) : (
                <PWAIconUploadButton
                  isUploading={isUploading}
                  uploadId={uploadId}
                  onFileSelect={handleIconUpload}
                  accept="image/png"
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};