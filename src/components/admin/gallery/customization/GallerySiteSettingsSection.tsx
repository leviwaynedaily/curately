import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type GallerySiteSettingsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GallerySiteSettingsSection = ({ form }: GallerySiteSettingsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFaviconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Starting favicon upload...");

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `favicons/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading favicon to storage...");
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading favicon:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("gallery_images")
        .getPublicUrl(filePath);

      console.log("Favicon uploaded successfully, public URL:", publicUrl);
      form.setValue("favicon", filePath);
      toast({ description: "Favicon uploaded successfully" });
    } catch (error) {
      console.error("Favicon upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload favicon. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFavicon = () => {
    form.setValue("favicon", "");
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Site Settings</h3>
      <FormField
        control={form.control}
        name="page_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Page Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter page title" 
                {...field} 
                value={field.value || form.getValues("name") || ''} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="favicon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Favicon</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {field.value ? (
                  <div className="relative w-16 h-16">
                    <img
                      src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                      alt="Favicon"
                      className="w-full h-full object-contain rounded-lg border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2"
                      onClick={clearFavicon}
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
                      onClick={() => document.getElementById("favicon-upload")?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload Favicon"}
                    </Button>
                    <Input
                      id="favicon-upload"
                      type="file"
                      accept="image/x-icon,image/png"
                      className="hidden"
                      onChange={handleFaviconUpload}
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
    </div>
  );
};