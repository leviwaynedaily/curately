import { AdminLayout } from "@/layouts/AdminLayout";
import { NewProductTable } from "@/components/admin/products/NewProductTable";
import { useParams } from "react-router-dom";

const NewProductManagement = () => {
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
      <div className="container mx-auto py-6 space-y-6">
        <NewProductTable storefrontId={storefrontId} />
      </div>
    </AdminLayout>
  );
};

export default NewProductManagement;