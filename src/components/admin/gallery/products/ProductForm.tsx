import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  storefrontId: string;
  onProductCreated: () => void;
};

export const ProductForm = ({
  isOpen,
  onClose,
  storefrontId,
  onProductCreated,
}: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    stock_quantity: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting product form with data:", formData);

    try {
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          storefront_id: storefrontId,
          name: formData.name,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : null,
          sku: formData.sku,
          category: formData.category,
          stock_quantity: parseInt(formData.stock_quantity),
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      console.log("Product created successfully:", product);
      toast({ description: "Product created successfully" });
      onProductCreated();
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        variant: "destructive",
        description: "Failed to create product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price
            </label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-1">
              SKU
            </label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="stock_quantity" className="block text-sm font-medium mb-1">
              Stock Quantity
            </label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};