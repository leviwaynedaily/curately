import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGalleryForm } from "@/hooks/useGalleryForm";
import { GalleryFormContent } from "./gallery/GalleryFormContent";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { Storefront } from "@/types/storefront";

type GalleryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  businessId?: string;
  gallery?: {
    id: string;
    name: string;
    status: string;
    password?: string;
    business_id?: string;
  };
};

export const GalleryForm = ({
  isOpen,
  onClose,
  businessId,
  gallery,
}: GalleryFormProps) => {
  const { form, isLoading, handleSubmit } = useGalleryForm({
    onClose,
    businessId,
    gallery,
  });

  const handleDialogClose = (open: boolean) => {
    // Only close if we're not in the products tab
    if (form.getValues("currentTab") !== "products") {
      onClose();
    }
  };

  const onSubmit = async (values: GalleryFormValues) => {
    await handleSubmit(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{gallery ? "Edit Storefront" : "Add Storefront"}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <GalleryFormContent
            form={form}
            isLoading={isLoading}
            onSubmit={onSubmit}
            onClose={onClose}
            galleryId={gallery?.id}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};