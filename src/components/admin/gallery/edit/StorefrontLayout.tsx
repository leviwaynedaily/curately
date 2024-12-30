import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { StorefrontPreview } from "@/components/storefront/StorefrontPreview";
import { StorefrontMainContent } from "./StorefrontMainContent";
import { UseFormReturn } from "react-hook-form";
import { GalleryFormValues } from "@/lib/validations/gallery";

type StorefrontLayoutProps = {
  storefront: any;
  form: UseFormReturn<GalleryFormValues>;
  isSaving: boolean;
  onSave: () => Promise<void>;
  storefrontId: string;
  showPreview: boolean;
  isMobile: boolean;
};

export const StorefrontLayout = ({
  storefront,
  form,
  isSaving,
  onSave,
  storefrontId,
  showPreview,
  isMobile,
}: StorefrontLayoutProps) => {
  console.log("StorefrontLayout render:", {
    isMobile,
    showPreview,
    storefrontId
  });

  const content = (
    <div className="p-4 h-full overflow-y-auto">
      <StorefrontMainContent
        storefront={storefront}
        form={form}
        isSaving={isSaving}
        onSave={onSave}
      />
    </div>
  );

  if (isMobile) {
    return content;
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-4rem)]">
      <ResizablePanel defaultSize={50} minSize={30}>
        {content}
      </ResizablePanel>
      {showPreview && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
            <StorefrontPreview storefrontId={storefrontId} />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};