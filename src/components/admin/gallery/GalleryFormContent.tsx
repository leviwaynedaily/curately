import { Form } from "@/components/ui/form";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryPasswordField } from "./GalleryPasswordField";
import { GalleryLogoField } from "./GalleryLogoField";
import { GalleryDescriptionField } from "./GalleryDescriptionField";
import { GalleryVerificationFields } from "./GalleryVerificationFields";
import { GalleryCustomizationFields } from "./GalleryCustomizationFields";
import { GalleryFormActions } from "./GalleryFormActions";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductManagement } from "./products/ProductManagement";

type GalleryFormContentProps = {
  form: UseFormReturn<GalleryFormValues>;
  isLoading: boolean;
  onSubmit: (values: GalleryFormValues) => Promise<void>;
  onClose: () => void;
  galleryId?: string;
};

export const GalleryFormContent = ({
  form,
  isLoading,
  onSubmit,
  onClose,
  galleryId,
}: GalleryFormContentProps) => {
  const handleTabChange = (value: string) => {
    form.setValue("currentTab", value);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
            <TabsTrigger value="products" disabled={!galleryId}>Products</TabsTrigger>
          </TabsList>
          
          <div className="h-[600px] overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <GalleryNameField form={form} />
              <GalleryBusinessField form={form} />
              <GalleryDescriptionField form={form} />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="page_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter page title" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="favicon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Favicon</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter favicon URL" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-4 mt-0">
              <GalleryVerificationFields form={form} />
            </TabsContent>
            
            <TabsContent value="customization" className="space-y-4 mt-0">
              <GalleryCustomizationFields form={form} />
            </TabsContent>

            <TabsContent value="products" className="space-y-4 mt-0">
              {galleryId ? (
                <ProductManagement storefrontId={galleryId} />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  Save the gallery first to manage products
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <GalleryFormActions isLoading={isLoading} onCancel={onClose} />
        </div>
      </form>
    </Form>
  );
};