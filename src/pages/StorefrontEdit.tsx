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
import { ChevronRight, Loader2 } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    defaultValues: storefront,
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/admin" className="hover:text-foreground transition-colors">
            Storefronts
          </a>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{storefront.name}</span>
        </div>
        <div className="flex items-center gap-4">
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Label htmlFor="show-preview" className="text-sm">
                Live Preview
              </Label>
              <Switch
                id="show-preview"
                checked={showPreview}
                onCheckedChange={setShowPreview}
              />
            </div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !form.formState.isDirty}
            variant="outline"
            className={cn(
              "transition-colors",
              form.formState.isDirty && "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </div>

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