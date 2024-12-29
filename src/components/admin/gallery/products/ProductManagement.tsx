import { useState } from "react";
import { ProductTableContainer } from "./table/ProductTableContainer";
import { useProducts } from "@/hooks/useProducts";
import { ProductTableToolbar } from "./table/ProductTableToolbar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProductManagementProps = {
  storefrontId: string;
};

export const ProductManagement = ({ storefrontId }: ProductManagementProps) => {
  const { products, isLoading, refetch } = useProducts(storefrontId);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    // Export logic here
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Import logic here
  };

  const handleDuplicateProducts = async (productIds: string[]) => {
    try {
      console.log("Duplicating products:", productIds);
      
      for (const productId of productIds) {
        const product = products.find(p => p.id === productId);
        if (!product) {
          console.error("Product not found:", productId);
          continue;
        }

        // Create a copy of the product without id and timestamps
        const productCopy = {
          storefront_id: product.storefront_id,
          name: `${product.name} (Copy)`,
          description: product.description,
          price: product.price,
          sku: product.sku,
          category: product.category,
          status: product.status,
          stock_quantity: product.stock_quantity
        };

        // Insert the new product
        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert(productCopy)
          .select()
          .single();

        if (productError) {
          console.error("Error duplicating product:", productError);
          throw productError;
        }

        console.log("Product duplicated successfully:", newProduct);

        // Fetch original product's media
        const { data: mediaData, error: mediaFetchError } = await supabase
          .from("product_media")
          .select("*")
          .eq("product_id", productId);

        if (mediaFetchError) {
          console.error("Error fetching product media:", mediaFetchError);
          continue;
        }

        // Duplicate each media item
        for (const media of mediaData || []) {
          // First, copy the file in storage
          const fileExt = media.file_path.split('.').pop();
          const newFilePath = `${newProduct.id}/${crypto.randomUUID()}.${fileExt}`;
          
          const { data: file, error: downloadError } = await supabase.storage
            .from("gallery_images")
            .download(media.file_path);

          if (downloadError) {
            console.error("Error downloading original file:", downloadError);
            continue;
          }

          const { error: uploadError } = await supabase.storage
            .from("gallery_images")
            .upload(newFilePath, file);

          if (uploadError) {
            console.error("Error uploading duplicated file:", uploadError);
            continue;
          }

          // Create new media record
          const { error: mediaError } = await supabase
            .from("product_media")
            .insert({
              product_id: newProduct.id,
              file_path: newFilePath,
              media_type: media.media_type,
              is_primary: media.is_primary,
              title: media.title,
              description: media.description
            });

          if (mediaError) {
            console.error("Error creating media record:", mediaError);
            continue;
          }

          console.log("Media duplicated successfully:", newFilePath);
        }
      }

      toast({ description: "Products duplicated successfully" });
      refetch();
    } catch (error) {
      console.error("Error duplicating products:", error);
      toast({
        variant: "destructive",
        description: "Failed to duplicate products",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <ProductTableToolbar
        onExport={handleExport}
        onImport={handleImport}
        onAddProduct={() => setIsFormOpen(true)}
      />
      <ProductTableContainer
        storefrontId={storefrontId}
        products={products}
        onProductUpdate={refetch}
        onDuplicate={handleDuplicateProducts}
      />
    </div>
  );
};
