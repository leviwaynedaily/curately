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

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error(`Error uploading ${type} screenshot:`, uploadError);
        throw uploadError;
      }

      console.log(`${type} screenshot uploaded successfully:`, uploadData);

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from("gallery_images")
        .getPublicUrl(filePath);
      
      console.log(`Public URL for ${type} screenshot:`, publicUrl);

      // Set the form value and validate
      form.setValue(fieldName, filePath, { 
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });

      // Log form state after update
      const formValues = form.getValues();
      console.log(`Form values after setting ${type} screenshot:`, {
        formValues,
        specificField: formValues[fieldName],
        isDirty: form.formState.isDirty,
        touchedFields: form.formState.touchedFields
      });
      
      toast({ description: `${type} screenshot uploaded successfully` });
    } catch (error) {
      console.error(`${type} screenshot upload failed:`, error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : `Failed to upload ${type} screenshot. Please try again.`,
      });
    } finally {
      setUploading(false);
    }
  };

  const clearScreenshot = (type: "desktop" | "mobile") => {
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    console.log(`Clearing ${type} screenshot`);
    
    form.setValue(fieldName, "", { 
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });

    // Log form state after clearing
    console.log(`Form state after clearing ${type} screenshot:`, {
      values: form.getValues(),
      isDirty: form.formState.isDirty,
      touchedFields: form.formState.touchedFields
    });
  };

  const renderScreenshotField = (type: "desktop" | "mobile") => {
    const isUploading = type === "desktop" ? isUploadingDesktop : isUploadingMobile;
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    const label = type === "desktop" ? "Desktop Screenshot (1920x1080)" : "Mobile Screenshot (390x844)";
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
            <FormLabel>{label}</FormLabel>
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
                      {isUploading ? "Uploading..." : `Upload ${label}`}
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
    <div className="space-y-4">
      <h3 className="font-medium">Screenshots</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload screenshots of your storefront for the PWA manifest. Desktop screenshot should be 1920x1080, and mobile screenshot should be 390x844.
      </p>
      {renderScreenshotField("desktop")}
      {renderScreenshotField("mobile")}
    </div>
  );
};