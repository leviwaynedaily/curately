import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type PWAIconsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const PWAIconsSection = ({ form }: PWAIconsSectionProps) => {
  const [isUploading192, setIsUploading192] = useState(false);
  const [isUploading512, setIsUploading512] = useState(false);
  const { toast } = useToast();

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>, size: "192" | "512") => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setIsUploading = size === "192" ? setIsUploading192 : setIsUploading512;
    const fieldName = size === "192" ? "pwa_icon_192" : "pwa_icon_512";
    
    setIsUploading(true);
    console.log(`Starting PWA icon ${size}x${size} upload...`, { file });

    try {
      // Validate file type
      if (!file.type.includes('png')) {
        throw new Error('Please upload a PNG file');
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `pwa-icons/${crypto.randomUUID()}.${fileExt}`;

      console.log(`Uploading ${size}x${size} icon to path:`, filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(`Error uploading ${size}x${size} PWA icon:`, uploadError);
        throw uploadError;
      }

      console.log(`${size}x${size} icon uploaded successfully:`, uploadData);

      // Set the form value and validate
      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      // Log form state after update
      const formValues = form.getValues();
      console.log(`Form values after setting ${size}x${size} PWA icon:`, {
        formValues,
        specificField: formValues[fieldName],
        isDirty: form.formState.isDirty,
        touchedFields: form.formState.touchedFields
      });
      
      toast({ description: `${size}x${size} PWA icon uploaded successfully` });
    } catch (error) {
      console.error(`PWA icon ${size}x${size} upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to upload PWA icon. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearIcon = (size: "192" | "512") => {
    const fieldName = size === "192" ? "pwa_icon_192" : "pwa_icon_512";
    console.log(`Clearing ${size}x${size} PWA icon`);
    
    form.setValue(fieldName, "", { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });

    // Log form state after clearing
    console.log(`Form state after clearing ${size}x${size} PWA icon:`, {
      values: form.getValues(),
      isDirty: form.formState.isDirty,
      touchedFields: form.formState.touchedFields
    });
  };

  const renderIconUpload = (size: "192" | "512") => {
    const fieldName = size === "192" ? "pwa_icon_192" : "pwa_icon_512";
    const isUploading = size === "192" ? isUploading192 : isUploading512;
    const value = form.watch(fieldName);

    console.log(`Rendering ${size}x${size} PWA icon upload field:`, {
      value,
      isUploading,
      fieldName
    });

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
                  <div className="relative w-16 h-16">
                    <img
                      src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                      alt={`PWA Icon ${size}x${size}`}
                      className="w-full h-full object-contain rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={() => clearIcon(size)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() => document.getElementById(`pwa-icon-${size}-upload`)?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Icon"}
                    </Button>
                    <Input
                      id={`pwa-icon-${size}-upload`}
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={(e) => handleIconUpload(e, size)}
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <div>
      <div className="space-y-2 mb-6">
        <h4 className="font-medium">PWA Icons</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Upload icons for your Progressive Web App (PWA). These icons will be displayed when users install your storefront on their devices.</p>
          <p>Requirements:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>PNG format only</li>
            <li>192×192 icon: Used for app icons on most devices</li>
            <li>512×512 icon: Used for larger displays and high-resolution devices</li>
            <li>Transparent background recommended</li>
            <li>Keep the file size under 1MB for better performance</li>
          </ul>
        </div>
      </div>
      <div className="space-y-6">
        {renderIconUpload("192")}
        {renderIconUpload("512")}
      </div>
    </div>
  );
};