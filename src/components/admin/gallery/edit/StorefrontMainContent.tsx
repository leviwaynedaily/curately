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
    formValues: form.getValues(),
    defaultValues: form.formState.defaultValues
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with values:", {
      headerDisplay: form.getValues("header_display"),
      allValues: form.getValues()
    });
    
    // Save the current values before saving
    const currentValues = form.getValues();
    
    await onSave();
    
    // Reset the form with the saved values to maintain state
    form.reset(currentValues, {
      keepValues: true,
      keepDirty: false,
      keepDefaultValues: true
    });
  };
  
  return (
    <div className="space-y-6">
      <StorefrontHeader 
        storefront={storefront} 
        form={form}
        isSaving={isSaving}
        onSave={onSave}
      />
      
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <StorefrontTabs form={form} />
        </form>
      </Form>
    </div>
  );
};