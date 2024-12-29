import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { getStorefrontFilePath } from "@/utils/storefrontFileUtils";

type GallerySiteLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GallerySiteLogoField = ({ form }: GallerySiteLogoFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Starting site logo upload...");

    try {
      const fileExt = file.name.split(".").pop();
      const storefrontId = form.getValues("id");
      if (!storefrontId) {
        throw new Error("Storefront ID is required");
      }

      const filePath = getStorefrontFilePath(storefrontId, 'site_logo', fileExt || 'png');
      console.log("Uploading site logo to path:", filePath);

      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error uploading site logo:", uploadError);
        throw uploadError;
      }

      console.log("Site logo uploaded successfully, file path:", filePath);
      form.setValue("site_logo", filePath, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true
      });
      
      toast({ description: "Site logo uploaded successfully" });
    } catch (error) {
      console.error("Site logo upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload site logo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearLogo = () => {
    form.setValue("site_logo", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    });
  };

  return (
    <FormField
      control={form.control}
      name="site_logo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site Logo</FormLabel>
          <div className="space-y-4">
            {field.value && typeof field.value === 'string' && field.value !== "" ? (
              <div className="relative w-40 h-40">
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                  alt="Site logo"
                  className="w-full h-full object-contain rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearLogo}
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
                    onClick={() => document.getElementById("site-logo-upload")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Site Logo"}
                  </Button>
                  <Input
                    id="site-logo-upload"
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