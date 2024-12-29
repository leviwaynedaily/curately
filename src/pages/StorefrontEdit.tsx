import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { GalleryCustomizationFields } from "@/components/admin/gallery/GalleryCustomizationFields";
import { GalleryInstructionsFields } from "@/components/admin/gallery/GalleryInstructionsFields";
import { GalleryVerificationFields } from "@/components/admin/gallery/GalleryVerificationFields";
import { StorefrontBasicInfo } from "@/components/admin/gallery/edit/StorefrontBasicInfo";
import { StorefrontHeader } from "@/components/admin/gallery/edit/StorefrontHeader";

const StorefrontEdit = () => {
  const { storefrontId } = useParams();
  console.log("Editing storefront:", storefrontId);

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          *,
          businesses (
            name
          )
        `)
        .eq("id", storefrontId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm({
    defaultValues: storefront,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!storefront) {
    return <div>Storefront not found</div>;
  }

  return (
    <div className="container py-6 space-y-6">
      <StorefrontHeader storefront={storefront} />
      
      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="verification">Age Verification</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <StorefrontBasicInfo storefront={storefront} />
        </TabsContent>

        <TabsContent value="customization" className="space-y-4">
          <GalleryCustomizationFields form={form} />
        </TabsContent>

        <TabsContent value="verification" className="space-y-4">
          <GalleryVerificationFields form={form} />
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <GalleryInstructionsFields form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StorefrontEdit;