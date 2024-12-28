import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

type GallerySiteSettingsSectionProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GallerySiteSettingsSection = ({ form }: GallerySiteSettingsSectionProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const siteName = form.watch("name");

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>, size: "192" | "512") => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log(`Starting PWA icon ${size}x${size} upload...`);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `pwa-icons/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading PWA icon to storage...");
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading PWA icon:", uploadError);
        throw uploadError;
      }

      console.log("PWA icon uploaded successfully, setting form value:", filePath);
      form.setValue(size === "192" ? "pwa_icon_192" : "pwa_icon_512", filePath);
      toast({ description: `${size}x${size} PWA icon uploaded successfully` });
    } catch (error) {
      console.error("PWA icon upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload PWA icon. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearIcon = (size: "192" | "512") => {
    form.setValue(size === "192" ? "pwa_icon_192" : "pwa_icon_512", "");
  };

  const renderIconUpload = (size: "192" | "512") => {
    const fieldName = size === "192" ? "pwa_icon_192" : "pwa_icon_512";
    const value = form.watch(fieldName);

    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{`PWA Icon (${size}x${size})`}</FormLabel>
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
                      {isUploading ? "Uploading..." : `Upload ${size}x${size} Icon`}
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
                value={field.value || siteName || ''} 
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
                      onClick={() => form.setValue("favicon", "")}
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setIsUploading(true);
                        console.log("Starting favicon upload...");

                        const fileExt = file.name.split(".").pop();
                        const filePath = `favicons/${crypto.randomUUID()}.${fileExt}`;

                        supabase.storage
                          .from("gallery_images")
                          .upload(filePath, file)
                          .then(({ error }) => {
                            if (error) throw error;
                            form.setValue("favicon", filePath);
                            toast({ description: "Favicon uploaded successfully" });
                          })
                          .catch((error) => {
                            console.error("Favicon upload failed:", error);
                            toast({
                              variant: "destructive",
                              description: "Failed to upload favicon. Please try again.",
                            });
                          })
                          .finally(() => {
                            setIsUploading(false);
                          });
                      }}
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

      <Separator className="my-6" />
      
      <div>
        <h4 className="font-medium mb-4">PWA Icons</h4>
        <div className="space-y-4">
          {renderIconUpload("192")}
          {renderIconUpload("512")}
        </div>
      </div>
    </div>
  );
};