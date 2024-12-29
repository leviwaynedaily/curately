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
import { GalleryFormValues } from "@/lib/validations/gallery";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Form } from "@/components/ui/form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";

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

  const form = useForm<GalleryFormValues>({
    defaultValues: storefront,
  });

  if (isLoading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (!storefront) {
    return <AdminLayout>Storefront not found</AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Storefronts</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{storefront.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <StorefrontHeader storefront={storefront} />
        
        <Form {...form}>
          <form>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="w-full justify-start">
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
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default StorefrontEdit;