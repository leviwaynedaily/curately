import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useGalleryForm } from "@/hooks/useGalleryForm";
import { StorefrontLayout } from "@/components/admin/gallery/edit/StorefrontLayout";

const StorefrontEdit = () => {
  const { storefrontId } = useParams();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  console.log("StorefrontEdit render:", {
    storefrontId,
    isMobile,
    showPreview
  });

  const { data: storefront, isLoading, refetch } = useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      // If this is a new storefront, return an empty object
      if (storefrontId === "new") {
        console.log("Creating new storefront template");
        return {
          id: "new",
          name: "New Storefront",
          status: "active"
        };
      }

      console.log("Fetching existing storefront:", storefrontId);
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

  const handleSave = async () => {
    console.log("Starting save with form values:", form.getValues());
    setIsSaving(true);
    try {
      await handleSubmit(form.getValues());
      form.reset(form.getValues());
      await refetch();
      const previewIframe = document.querySelector('iframe') as HTMLIFrameElement;
      if (previewIframe) {
        console.log("Reloading preview iframe");
        previewIframe.src = previewIframe.src;
      }
      console.log("Save completed and preview reloaded");
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

  return (
    <AdminLayout>
      <StorefrontLayout
        storefront={storefront}
        form={form}
        isSaving={isSaving}
        onSave={handleSave}
        storefrontId={storefrontId!}
        showPreview={showPreview}
        isMobile={isMobile}
      />
    </AdminLayout>
  );
};

export default StorefrontEdit;