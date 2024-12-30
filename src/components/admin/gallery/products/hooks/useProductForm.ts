import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "../types";
import { getProductMediaPath } from "@/utils/storefrontFileUtils";

export const useProductForm = (
  storefrontId: string,
  product?: Product,
  onProductCreated: () => void,
  onClose: () => void
) => {
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
        const filePath = getProductMediaPath(storefrontId, productId, file.name);
        
        console.log(`Uploading file ${i + 1}/${mediaFiles.length}:`, filePath);

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
            is_primary: i === 0,
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

  return {
    formData,
    isLoading,
    uploadingMedia,
    previewUrls,
    handleChange,
    handleMediaSelect,
    removeMedia,
    handleSubmit,
  };
};