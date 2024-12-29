import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Form } from "@/components/ui/form";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { StorefrontTabs } from "@/components/admin/gallery/edit/StorefrontTabs";
import { StorefrontHeader } from "@/components/admin/gallery/edit/StorefrontHeader";
import { StorefrontPreview } from "@/components/admin/gallery/edit/StorefrontPreview";
import { useGalleryForm } from "@/hooks/useGalleryForm";

const StorefrontEdit = () => {
  const { storefrontId } = useParams();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  console.log("Editing storefront:", storefrontId);

  const { data: storefront, isLoading } = useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("storefronts")
        .select(`
          *,
          business:business_id (
            name
          )
        `)
        .eq("id", storefrontId)
        .single();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Storefront data fetched:", data);
      return data;
    },
  });

  const { form, handleSubmit } = useGalleryForm({
    onClose: () => {},
    gallery: storefront,
  });

  console.log("Form state:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    isLoading
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await handleSubmit(form.getValues());
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (!storefront) {
    return <AdminLayout>Storefront not found</AdminLayout>;
  }

  const MainContent = () => (
    <div className="space-y-6">
      <StorefrontHeader 
        storefront={storefront} 
        form={form}
        isSaving={isSaving}
        onSave={handleSave}
      />
      
      <Form {...form}>
        <form>
          <StorefrontTabs form={form} />
        </form>
      </Form>
    </div>
  );

  return (
    <AdminLayout>
      {isMobile ? (
        <MainContent />
      ) : (
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
          <ResizablePanel defaultSize={50}>
            <div className="p-4 h-full overflow-y-auto">
              <MainContent />
            </div>
          </ResizablePanel>
          {showPreview && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50}>
                <StorefrontPreview storefrontId={storefrontId!} />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}
    </AdminLayout>
  );
};

export default StorefrontEdit;