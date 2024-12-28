import { ProductManagement as ProductManagementComponent } from "@/components/admin/gallery/products/ProductManagement";
import { useParams } from "react-router-dom";

const ProductManagement = () => {
  const { galleryId } = useParams();

  if (!galleryId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Gallery ID is required
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ProductManagementComponent galleryId={galleryId} />
    </div>
  );
};

export default ProductManagement;