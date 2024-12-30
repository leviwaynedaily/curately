import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "./types";
import { ProductFormFields } from "./form/ProductFormFields";
import { ProductMediaUpload } from "./form/ProductMediaUpload";
import { ProductFormActions } from "./form/ProductFormActions";
import { useProductForm } from "./hooks/useProductForm";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  storefrontId: string;
  onProductCreated: () => void;
  product?: Product;
};

export const ProductForm = ({
  isOpen,
  onClose,
  storefrontId,
  onProductCreated,
  product,
}: ProductFormProps) => {
  const {
    formData,
    isLoading,
    uploadingMedia,
    previewUrls,
    handleChange,
    handleMediaSelect,
    removeMedia,
    handleSubmit,
  } = useProductForm(storefrontId, product, onProductCreated, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductFormFields
            formData={formData}
            handleChange={handleChange}
          />
          
          <ProductMediaUpload
            previewUrls={previewUrls}
            uploadingMedia={uploadingMedia}
            onMediaSelect={handleMediaSelect}
            onRemoveMedia={removeMedia}
          />

          <ProductFormActions
            isLoading={isLoading}
            uploadingMedia={uploadingMedia}
            onClose={onClose}
            isEditMode={!!product}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};