import { AdminLayout } from "@/layouts/AdminLayout";
import { ProductManagement as ProductManagementComponent } from "@/components/admin/gallery/products/ProductManagement";
import { useParams } from "react-router-dom";
import { GalleryHeader } from "@/components/gallery/GalleryHeader";

const ProductManagement = () => {
  const { storefrontId } = useParams();

  if (!storefrontId) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          Storefront ID is required
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto space-y-6">
        <GalleryHeader name="Product Management" />
        <ProductManagementComponent storefrontId={storefrontId} />
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;