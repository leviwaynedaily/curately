import { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type GalleryLogoFieldProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const GalleryLogoField = ({ form }: GalleryLogoFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    console.log("Starting logo upload...");

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `gallery-logos/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading logo to storage...");
      const { error: uploadError } = await supabase.storage
        .from("gallery_images")
        .upload(filePath, file);

      if (uploadError) {
        console.error("Error uploading logo:", uploadError);
        throw uploadError;
      }

      console.log("Logo uploaded successfully, file path:", filePath);
      form.setValue("logo", filePath);
      toast({ description: "Logo uploaded successfully" });
    } catch (error) {
      console.error("Logo upload failed:", error);
      toast({
        variant: "destructive",
        description: "Failed to upload logo. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearLogo = () => {
    form.setValue("logo", "");
  };

  return (
    <FormField
      control={form.control}
      name="logo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Logo</FormLabel>
          <div className="space-y-4">
            {field.value ? (
              <div className="relative w-40 h-40">
                <img
                  src={supabase.storage.from("gallery_images").getPublicUrl(field.value).data.publicUrl}
                  alt="Gallery logo"
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
                    onClick={() => document.getElementById("logo-upload")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Logo"}
                  </Button>
                  <Input
                    id="logo-upload"
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