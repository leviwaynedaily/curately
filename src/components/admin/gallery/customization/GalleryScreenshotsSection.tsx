import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type GalleryScreenshotsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryScreenshotsSection = ({ form }: GalleryScreenshotsSectionProps) => {
  const [isUploadingDesktop, setIsUploadingDesktop] = useState(false);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  const { toast } = useToast();

  const handleScreenshotUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setUploading = type === "desktop" ? setIsUploadingDesktop : setIsUploadingMobile;
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    
    setUploading(true);
    console.log(`Starting ${type} screenshot upload...`, { file });

    try {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `screenshots/${crypto.randomUUID()}.${fileExt}`;

      console.log(`Uploading ${type} screenshot to path:`, filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(`Error uploading ${type} screenshot:`, uploadError);
        throw uploadError;
      }

      console.log(`${type} screenshot uploaded successfully to path:`, filePath);

      // Set the form value with the file path
      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      // Log form state after update
      console.log(`Form state after setting ${type} screenshot:`, {
        values: form.getValues(),
        isDirty: form.formState.isDirty,
        touchedFields: form.formState.touchedFields
      });
      
      toast({ description: `${type} screenshot uploaded successfully` });
    } catch (error) {
      console.error(`${type} screenshot upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : `Failed to upload ${type} screenshot`,
      });
    } finally {
      setUploading(false);
    }
  };

  const clearScreenshot = async (type: "desktop" | "mobile") => {
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    const currentPath = form.getValues(fieldName);
    
    console.log(`Clearing ${type} screenshot:`, currentPath);
    
    if (currentPath) {
      try {
        // Delete the file from storage
        const { error: deleteError } = await supabase.storage
          .from("gallery_images")
          .remove([currentPath]);

        if (deleteError) {
          console.error(`Error deleting ${type} screenshot:`, deleteError);
          throw deleteError;
        }

        // Clear the form value
        form.setValue(fieldName, "", { 
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true
        });

        console.log(`Successfully cleared ${type} screenshot`);
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

  const renderScreenshotField = (type: "desktop" | "mobile") => {
    const isUploading = type === "desktop" ? isUploadingDesktop : isUploadingMobile;
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    const label = type === "desktop" ? "Desktop Screenshot" : "Mobile Screenshot";
    const dimensions = type === "desktop" ? "(1920×1080)" : "(390×844)";
    const uploadId = `${type}-screenshot-upload`;
    const value = form.watch(fieldName);

    console.log(`Rendering ${type} screenshot field:`, {
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
              {label}
              <span className="text-sm text-muted-foreground font-normal">
                {dimensions}
              </span>
            </FormLabel>
            <div className="space-y-4">
              {field.value ? (
                <div className="relative w-full max-w-md">
                  <img
                    src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                    alt={`${type} screenshot`}
                    className="w-full h-auto object-contain rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => clearScreenshot(type)}
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
                      onChange={(e) => handleScreenshotUpload(e, type)}
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Screenshots</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Upload screenshots of your storefront for the PWA manifest.</p>
          <p>Desktop screenshot should be 1920×1080 pixels, and mobile screenshot should be 390×844 pixels.</p>
          <p>These screenshots will be displayed when users install your storefront as a PWA.</p>
        </div>
      </div>
      <div className="space-y-8">
        {renderScreenshotField("desktop")}
        {renderScreenshotField("mobile")}
      </div>
    </div>
  );
};