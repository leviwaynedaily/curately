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
    formIsDirty: form?.formState?.isDirty
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
        <form>
          <StorefrontTabs form={form} />
        </form>
      </Form>
    </div>
  );
};