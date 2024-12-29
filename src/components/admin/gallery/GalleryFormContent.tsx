import { Form } from "@/components/ui/form";
import { GalleryVerificationFields } from "./GalleryVerificationFields";
import { GalleryCustomizationFields } from "./GalleryCustomizationFields";
import { GalleryInstructionsFields } from "./GalleryInstructionsFields";
import { GalleryFormActions } from "./GalleryFormActions";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { GalleryBasicFields } from "./GalleryBasicFields";

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
  const [currentTab, setCurrentTab] = useState("basic");

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    form.setValue("currentTab", value);
  };

  const handleSubmit = async (values: GalleryFormValues) => {
    try {
      await onSubmit(values);
      handleTabChange(currentTab);
    } catch (error) {
      console.error("Error saving form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Tabs value={currentTab} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          
          <div className="h-[600px] overflow-y-auto mt-4">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <GalleryBasicFields form={form} />
            </TabsContent>
            
            <TabsContent value="verification" className="space-y-4 mt-0">
              <GalleryVerificationFields form={form} />
            </TabsContent>

            <TabsContent value="instructions" className="space-y-4 mt-0">
              <GalleryInstructionsFields form={form} />
            </TabsContent>
            
            <TabsContent value="customization" className="space-y-4 mt-0">
              <GalleryCustomizationFields form={form} />
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