import { ProductTable } from "./ProductTable";
import { useProducts } from "@/hooks/useProducts";
import { MediaMigrationButton } from "./media/MediaMigrationButton";

type ProductManagementProps = {
  storefrontId: string;
};

export const ProductManagement = ({ storefrontId }: ProductManagementProps) => {
  const { products, isLoading, refetch } = useProducts(storefrontId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products</h2>
        <MediaMigrationButton />
      </div>
      <ProductTable
        storefrontId={storefrontId}
        products={products}
        onProductUpdate={refetch}
      />
    </div>
  );
};