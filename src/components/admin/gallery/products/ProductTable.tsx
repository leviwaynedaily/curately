import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Trash, Download, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  sku: string | null;
  category: string | null;
  stock_quantity: number | null;
  status: string;
};

type ProductTableProps = {
  galleryId: string;
  products: Product[];
  onProductUpdate: () => void;
};

export const ProductTable = ({ galleryId, products, onProductUpdate }: ProductTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct(product);
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
          return row
            .split(",")
            .map((cell) => cell.replace(/^"(.*)"$/, "$1"));
        });

        // Skip header row
        const products = rows.slice(1).map((row) => ({
          gallery_id: galleryId,
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
      <div className="flex flex-wrap gap-4">
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editedProduct?.name || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev ? { ...prev, name: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editedProduct?.description || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev ? { ...prev, description: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    product.description
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editedProduct?.price || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev
                            ? { ...prev, price: parseFloat(e.target.value) }
                            : null
                        )
                      }
                    />
                  ) : (
                    product.price
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editedProduct?.sku || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev ? { ...prev, sku: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    product.sku
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editedProduct?.category || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev ? { ...prev, category: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    product.category
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editedProduct?.stock_quantity || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev
                            ? {
                                ...prev,
                                stock_quantity: parseInt(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  ) : (
                    product.stock_quantity
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editedProduct?.status || ""}
                      onChange={(e) =>
                        setEditedProduct((prev) =>
                          prev ? { ...prev, status: e.target.value } : null
                        )
                      }
                    />
                  ) : (
                    product.status
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {editingId === product.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSave}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};