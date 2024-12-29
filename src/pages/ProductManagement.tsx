import { AdminLayout } from "@/layouts/AdminLayout";
import { ProductManagement as ProductManagementComponent } from "@/components/admin/gallery/products/ProductManagement";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const { storefrontId } = useParams();
  const navigate = useNavigate();

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
      <div className="container mx-auto py-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 -ml-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Storefronts
          </Button>
        </div>
        <ProductManagementComponent storefrontId={storefrontId} />
      </div>
    </AdminLayout>
  );
};

export default ProductManagement;