import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductTableHeader } from "./ProductTableHeader";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTableActions } from "./ProductTableActions";
import { ProductMediaDialog } from "./ProductMediaDialog";
import { Product } from "./types";

type ProductTableProps = {
  storefrontId: string;
  products: Product[];
  onProductUpdate: () => void;
};

export const ProductTable = ({
  storefrontId,
  products,
  onProductUpdate,
}: ProductTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct(product);
  };

  const handleProductChange = (field: keyof Product, value: any) => {
    setEditedProduct((prev) =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleSave = async () => {
    if (!editedProduct) return;

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editedProduct.name,
          description: editedProduct.description,
          price: editedProduct.price,
          sku: editedProduct.sku,
          category: editedProduct.category,
          stock_quantity: editedProduct.stock_quantity,
          status: editedProduct.status,
        })
        .eq("id", editedProduct.id);

      if (error) throw error;

      toast({ description: "Product updated successfully" });
      setEditingId(null);
      setEditedProduct(null);
      onProductUpdate();
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to update product",
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct(null);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      toast({ description: "Product deleted successfully" });
      onProductUpdate();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete product",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ["Name", "Description", "Price", "SKU", "Category", "Stock", "Status"],
      ...products.map((product) => [
        product.name,
        product.description || "",
        product.price?.toString() || "",
        product.sku || "",
        product.category || "",
        product.stock_quantity?.toString() || "",
        product.status,
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => {
          return row.split(",").map((cell) => cell.replace(/^"(.*)"$/, "$1"));
        });

        // Skip header row
        const products = rows.slice(1).map((row) => ({
          storefront_id: storefrontId,
          name: row[0],
          description: row[1] || null,
          price: row[2] ? parseFloat(row[2]) : null,
          sku: row[3] || null,
          category: row[4] || null,
          stock_quantity: row[5] ? parseInt(row[5]) : null,
          status: row[6] || "active",
        }));

        const { error } = await supabase.from("products").insert(products);

        if (error) throw error;

        toast({ description: "Products imported successfully" });
        onProductUpdate();
      } catch (error) {
        console.error("Error importing products:", error);
        toast({
          variant: "destructive",
          description: "Failed to import products",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <ProductTableActions
        onExport={handleExport}
        onImport={handleImport}
        galleryId={storefrontId}
      />

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <ProductTableHeader />
          <TableBody>
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                isEditing={editingId === product.id}
                editedProduct={editedProduct}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
                onProductChange={handleProductChange}
                onMediaClick={setSelectedProduct}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedProduct && (
        <ProductMediaDialog
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onMediaUpdate={onProductUpdate}
        />
      )}
    </div>
  );
};
