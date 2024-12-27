import { Form } from "@/components/ui/form";
import { GalleryNameField } from "./GalleryNameField";
import { GalleryBusinessField } from "./GalleryBusinessField";
import { GalleryPasswordField } from "./GalleryPasswordField";
import { GalleryLogoField } from "./GalleryLogoField";
import { GalleryDescriptionField } from "./GalleryDescriptionField";
import { GalleryCustomizationFields } from "./GalleryCustomizationFields";
import { GalleryFormActions } from "./GalleryFormActions";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GalleryFormContentProps = {
  form: UseFormReturn<GalleryFormValues>;
  isLoading: boolean;
  onSubmit: (values: GalleryFormValues) => Promise<void>;
  onCancel: () => void;
};

export const GalleryFormContent = ({
  form,
  isLoading,
  onSubmit,
  onCancel,
}: GalleryFormContentProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="customization">Customization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 mt-4">
            <GalleryNameField form={form} />
            <GalleryBusinessField form={form} />
            <GalleryPasswordField form={form} />
            <GalleryLogoField form={form} />
            <GalleryDescriptionField form={form} />
          </TabsContent>
          
          <TabsContent value="customization" className="space-y-4 mt-4">
            <GalleryCustomizationFields form={form} />
          </TabsContent>
        </Tabs>

        <GalleryFormActions isLoading={isLoading} onCancel={onCancel} />
      </form>
    </Form>
  );
};