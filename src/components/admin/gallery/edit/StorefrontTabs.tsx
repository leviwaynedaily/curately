import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StorefrontBasicInfo } from "./StorefrontBasicInfo";
import { GalleryCustomizationFields } from "../GalleryCustomizationFields";
import { GalleryInstructionsFields } from "../GalleryInstructionsFields";
import { GalleryVerificationFields } from "../GalleryVerificationFields";
import { GalleryPWAFields } from "../pwa/GalleryPWAFields";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type StorefrontTabsProps = {
  form: UseFormReturn<GalleryFormValues>;
};

export const StorefrontTabs = ({ form }: StorefrontTabsProps) => {
  console.log("StorefrontTabs render, form state:", {
    isDirty: form.formState.isDirty,
    dirtyFields: form.formState.dirtyFields
  });

  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="basic">Basic Information</TabsTrigger>
        <TabsTrigger value="customization">Customization</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="instructions">Instructions</TabsTrigger>
        <TabsTrigger value="pwa">PWA</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="space-y-4">
        <StorefrontBasicInfo form={form} />
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

      <TabsContent value="pwa" className="space-y-4">
        <GalleryPWAFields form={form} />
      </TabsContent>
    </Tabs>
  );
};