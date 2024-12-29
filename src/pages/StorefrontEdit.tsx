import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Form } from "@/components/ui/form";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { StorefrontTabs } from "@/components/admin/gallery/edit/StorefrontTabs";
import { StorefrontHeader } from "@/components/admin/gallery/edit/StorefrontHeader";

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

  const form = useForm<GalleryFormValues>({
    defaultValues: storefront || {},
  });

  console.log("Form state:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields,
    isLoading
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await form.handleSubmit(async (values) => {
        console.log("Saving storefront with values:", values);
        const { error } = await supabase
          .from("storefronts")
          .update(values)
          .eq("id", storefrontId);
        
        if (error) {
          console.error("Error saving storefront:", error);
          throw error;
        }
        console.log("Storefront saved successfully");
      })();
    } catch (error) {
      console.error("Error saving storefront:", error);
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

  const PreviewPanel = () => (
    <div className="w-full h-full bg-neutral-50 rounded-lg p-4">
      <iframe
        src={`/storefront/${storefrontId}`}
        className="w-full h-full rounded border-0"
        title="Storefront Preview"
      />
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
                <PreviewPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}
    </AdminLayout>
  );
};

export default StorefrontEdit;