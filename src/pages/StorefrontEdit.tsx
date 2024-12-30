import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/layouts/AdminLayout";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { useGalleryForm } from "@/hooks/useGalleryForm";
import { StorefrontLayout } from "@/components/admin/gallery/edit/StorefrontLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const StorefrontEdit = () => {
  const { storefrontId } = useParams();
  const isMobile = useIsMobile();
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  console.log("StorefrontEdit render:", {
    storefrontId,
    isMobile,
    showPreview,
    selectedBusinessId
  });

  // First, check if user is platform admin
  const { data: userProfile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      console.log("Fetching user profile");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return null;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      console.log("User profile:", profile);
      return profile;
    }
  });

  // Fetch all businesses if platform admin, otherwise just user's business
  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ["businesses", userProfile?.role],
    queryFn: async () => {
      if (!userProfile) return null;

      console.log("Fetching businesses for role:", userProfile.role);
      let query = supabase.from("businesses").select("*");
      
      if (userProfile.role !== "platform_admin") {
        query = query.eq("owner_id", userProfile.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching businesses:", error);
        return null;
      }

      console.log("Fetched businesses:", data);
      return data;
    },
    enabled: !!userProfile
  });

  const { data: storefront, isLoading, refetch } = useQuery({
    queryKey: ["storefront", storefrontId],
    queryFn: async () => {
      // If this is a new storefront, return a template object
      if (storefrontId === "new") {
        if (!selectedBusinessId && !businesses?.[0]?.id) {
          console.log("No business selected for new storefront");
          return null;
        }
        
        const businessId = selectedBusinessId || businesses?.[0]?.id;
        console.log("Creating new storefront template with business_id:", businessId);
        return {
          id: undefined,
          business_id: businessId,
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
    enabled: !!storefrontId && (!isLoadingBusinesses || storefrontId !== "new"),
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

  if (isLoading || isLoadingBusinesses) {
    return <AdminLayout>Loading...</AdminLayout>;
  }

  if (!businesses?.length) {
    return (
      <AdminLayout>
        <Alert>
          <AlertDescription>
            You need to create a business before you can create a storefront.
            Please go back and create a business first.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  // Show business selector for new storefronts if platform admin
  if (storefrontId === "new" && userProfile?.role === "platform_admin") {
    if (!selectedBusinessId) {
      return (
        <AdminLayout>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select a Business</h2>
            <div className="max-w-md">
              <Select
                value={selectedBusinessId || ""}
                onValueChange={(value) => setSelectedBusinessId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses?.map((business) => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => setSelectedBusinessId(businesses[0].id)}
              disabled={!businesses?.length}
            >
              Continue
            </Button>
          </div>
        </AdminLayout>
      );
    }
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