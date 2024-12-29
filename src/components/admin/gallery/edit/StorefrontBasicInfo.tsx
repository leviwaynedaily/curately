import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { GalleryNameField } from "../GalleryNameField";
import { GalleryDescriptionField } from "../GalleryDescriptionField";
import { GalleryLogoField } from "../GalleryLogoField";
import { GallerySiteLogoField } from "../GallerySiteLogoField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";

type StorefrontBasicInfoProps = {
  storefront: any;
};

export const StorefrontBasicInfo = ({ storefront }: StorefrontBasicInfoProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: storefront.name || "",
      description: storefront.description || "",
      logo: storefront.logo || "",
      site_logo: storefront.site_logo || "",
    },
  });

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    console.log("Updating storefront basic info:", values);

    try {
      const { error } = await supabase
        .from("storefronts")
        .update(values)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <GalleryNameField form={form} />
        <GalleryDescriptionField form={form} />
        <GalleryLogoField form={form} />
        <GallerySiteLogoField form={form} />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};