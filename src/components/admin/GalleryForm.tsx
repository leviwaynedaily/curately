import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGalleryForm } from "@/hooks/useGalleryForm";
import { GalleryFormContent } from "./gallery/GalleryFormContent";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gallery ? "Edit Gallery" : "Add Gallery"}</DialogTitle>
        </DialogHeader>
        <GalleryFormContent
          form={form}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};