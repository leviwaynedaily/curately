import { Form } from "@/components/ui/form";
import { StorefrontTabs } from "./StorefrontTabs";
import { StorefrontHeader } from "./StorefrontHeader";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type StorefrontMainContentProps = {
  storefront: any;
  form: UseFormReturn<GalleryFormValues>;
  isSaving: boolean;
  onSave: () => Promise<void>;
};

export const StorefrontMainContent = ({
  storefront,
  form,
  isSaving,
  onSave,
}: StorefrontMainContentProps) => {
  console.log("StorefrontMainContent render:", {
    hasStorefront: !!storefront,
    formIsDirty: form?.formState?.isDirty,
    headerDisplay: form.watch("header_display"),
    formValues: form.getValues()
  });

  return (
    <div className="space-y-6">
      <StorefrontHeader 
        storefront={storefront} 
        form={form}
        isSaving={isSaving}
        onSave={onSave}
      />
      
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}>
          <StorefrontTabs form={form} />
        </form>
      </Form>
    </div>
  );
};