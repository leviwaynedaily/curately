import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { GalleryLogoField } from "../GalleryLogoField";
import { GallerySiteLogoField } from "../GallerySiteLogoField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type StorefrontBasicInfoProps = {
  storefront: any;
};

export const StorefrontBasicInfo = ({ storefront }: StorefrontBasicInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: storefront.name || "",
    description: storefront.description || "",
    logo: storefront.logo || "",
    site_logo: storefront.site_logo || "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Updating storefront basic info:", formData);

    try {
      const { error } = await supabase
        .from("storefronts")
        .update(formData)
        .eq("id", storefront.id);

      if (error) throw error;

      toast({ description: "Storefront updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["storefront", storefront.id] });
    } catch (error) {
      console.error("Error updating storefront:", error);
      toast({
        variant: "destructive",
        description: "Failed to update storefront",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GalleryNameField
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
      />
      <GalleryDescriptionField
        value={formData.description}
        onChange={(value) => handleChange("description", value)}
      />
      <GalleryLogoField
        value={formData.logo}
        onChange={(value) => handleChange("logo", value)}
      />
      <GallerySiteLogoField
        value={formData.site_logo}
        onChange={(value) => handleChange("site_logo", value)}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
};