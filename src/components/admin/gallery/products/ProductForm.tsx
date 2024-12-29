import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./types";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  storefrontId: string;
  onProductCreated: () => void;
  product?: Product; // Add this prop for editing mode
};

export const ProductForm = ({
  isOpen,
  onClose,
  storefrontId,
  onProductCreated,
  product,
}: ProductFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    stock_quantity: "0",
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Initialize form data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        sku: product.sku || "",
        category: product.category || "",
        stock_quantity: product.stock_quantity?.toString() || "0",
      });

      // Set preview URLs for existing media
      if (product.product_media) {
        const urls = product.product_media.map(media => 
          `${supabase.storage.from('gallery_images').getPublicUrl(media.file_path).data.publicUrl}`
        );
        setPreviewUrls(urls);
      }
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log("Selected media files:", files);
    
    setMediaFiles(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMedia = async (productId: string) => {
    console.log("Starting media upload for product:", productId);
    setUploadingMedia(true);

    try {
      for (let i = 0; i < mediaFiles.length; i++) {
        const file = mediaFiles[i];
        const fileExt = file.name.split(".").pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;
        
        console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, file.name);

        const { error: uploadError } = await supabase.storage
          .from("gallery_images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from("product_media")
          .insert({
            product_id: productId,
            file_path: filePath,
            media_type: file.type.startsWith("video/") ? "video" : "image",
            is_primary: i === 0, // First media file is set as primary
            title: file.name,
          });

        if (dbError) throw dbError;
        
        console.log(`Successfully uploaded file ${i + 1}/${mediaFiles.length}`);
      }

      console.log("All media files uploaded successfully");
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error;
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting product form with data:", formData);

    try {
      if (product) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price ? parseFloat(formData.price) : null,
            sku: formData.sku,
            category: formData.category,
            stock_quantity: parseInt(formData.stock_quantity),
          })
          .eq("id", product.id);

        if (error) throw error;

        console.log("Product updated successfully");
        toast({ description: "Product updated successfully" });
      } else {
        // Create new product
        const { data: newProduct, error } = await supabase
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

        console.log("Product created successfully:", newProduct);

        if (mediaFiles.length > 0) {
          await uploadMedia(newProduct.id);
        }

        toast({ description: "Product created successfully" });
      }

      onProductCreated();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        variant: "destructive",
        description: "Failed to save product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Media
            </label>
            <div className="grid grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={() => removeMedia(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "aspect-square flex flex-col items-center justify-center gap-2",
                  "border-2 border-dashed",
                  uploadingMedia && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => document.getElementById("media-upload")?.click()}
                disabled={uploadingMedia}
              >
                <ImageIcon className="h-6 w-6" />
                <span className="text-xs">Add Media</span>
              </Button>
            </div>
            <Input
              id="media-upload"
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleMediaSelect}
              disabled={uploadingMedia}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || uploadingMedia}
            >
              {isLoading || uploadingMedia ? (product ? "Saving..." : "Creating...") : (product ? "Save Changes" : "Create Product")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};