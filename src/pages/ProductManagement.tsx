import { ProductManagement as ProductManagementComponent } from "@/components/admin/gallery/products/ProductManagement";
import { useParams } from "react-router-dom";

const ProductManagement = () => {
  const { storefrontId } = useParams();

  if (!storefrontId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Storefront ID is required
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ProductManagementComponent storefrontId={storefrontId} />
    </div>
  );
};

export default ProductManagement;