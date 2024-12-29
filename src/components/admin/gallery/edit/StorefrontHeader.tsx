import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type StorefrontHeaderProps = {
  storefront: any;
  form: UseFormReturn<GalleryFormValues>;
  isSaving: boolean;
  onSave: () => Promise<void>;
};

export const StorefrontHeader = ({ 
  storefront, 
  form,
  isSaving,
  onSave
}: StorefrontHeaderProps) => {
  console.log("StorefrontHeader render:", {
    formExists: !!form,
    isDirty: form?.formState?.isDirty,
    dirtyFields: form?.formState?.dirtyFields,
    storefrontName: storefront?.name
  });

  if (!form) {
    console.warn("Form is undefined in StorefrontHeader");
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/admin" className="hover:text-foreground transition-colors">
          Storefronts
        </a>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{storefront?.name || 'Loading...'}</span>
      </div>
      <Button 
        onClick={onSave} 
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
  );
};