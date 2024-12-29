import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useState } from "react";
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
    setUploading(true);
    console.log(`Starting ${type} screenshot upload...`);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `screenshots/${crypto.randomUUID()}.${fileExt}`;

      console.log(`Uploading ${type} screenshot to storage...`);
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      console.log(`${type} screenshot uploaded successfully, file path:`, filePath);
      form.setValue(type === "desktop" ? "screenshot_desktop" : "screenshot_mobile", filePath);
      toast({ description: `${type} screenshot uploaded successfully` });
    } catch (error) {
      console.error(`${type} screenshot upload failed:`, error);
      toast({
        variant: "destructive",
        description: `Failed to upload ${type} screenshot. Please try again.`,
      });
    } finally {
      setUploading(false);
    }
  };

  const clearScreenshot = (type: "desktop" | "mobile") => {
    form.setValue(type === "desktop" ? "screenshot_desktop" : "screenshot_mobile", "");
  };

  const renderScreenshotField = (type: "desktop" | "mobile") => {
    const isUploading = type === "desktop" ? isUploadingDesktop : isUploadingMobile;
    const fieldName = type === "desktop" ? "screenshot_desktop" : "screenshot_mobile";
    const label = type === "desktop" ? "Desktop Screenshot" : "Mobile Screenshot";
    const uploadId = `${type}-screenshot-upload`;

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-4">
              {field.value ? (
                <div className="relative w-40 h-40">
                  <img
                    src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                    alt={`${type} screenshot`}
                    className="w-full h-full object-contain rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => clearScreenshot(type)}
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
      {renderScreenshotField("desktop")}
      {renderScreenshotField("mobile")}
    </div>
  );
};