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
      // If this is a new storefront, return a template object without querying the database
      if (storefrontId === "new") {
        console.log("Creating new storefront template");
        return {
          id: undefined,
          name: "New Storefront",
          status: "active",
          show_description: true,
          primary_color: "#141413",
          secondary_color: "#E6E4DD",
          accent_color: "#9b87f5",
          primary_font_color: "#000000",
          secondary_font_color: "#6E59A5",
          accent_font_color: "#8B5CF6",
          heading_text: "Age Verification Required",
          subheading_text: "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
          age_verification_text: "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
          button_text: "Enter Site",
          instructions_button_text: "Enter Site"
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
        .maybeSingle();

      if (error) {
        console.error("Error fetching storefront:", error);
        throw error;
      }

      console.log("Storefront data fetched:", data);
      return data;
    },
    enabled: !!storefrontId,
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

  // Don't show preview for new storefronts since they don't have an ID yet
  const shouldShowPreview = showPreview && storefrontId !== "new";

  return (
    <AdminLayout>
      <StorefrontLayout
        storefront={storefront}
        form={form}
        isSaving={isSaving}
        onSave={handleSave}
        storefrontId={storefrontId!}
        showPreview={shouldShowPreview}
        isMobile={isMobile}
      />
    </AdminLayout>
  );
};

export default StorefrontEdit;