import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Product } from "@/components/admin/gallery/products/types";
import { formatCurrency } from "@/lib/utils";
import { ProductMediaCarousel } from "./ProductMediaCarousel";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type ProductDetailsDialogProps = {
  product: Product | null;
  onClose: () => void;
  allowDownload?: boolean;
  accentColor?: string;
};

export const ProductDetailsDialog = ({ 
  product, 
  onClose,
  allowDownload = false,
  accentColor = '#8B5CF6'
}: ProductDetailsDialogProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  if (!product) return null;

  const handleDoubleClick = (field: string) => {
    setEditingField(field);
    setEditedProduct(product);
  };

  const handleChange = (field: string, value: any) => {
    setEditedProduct(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSave = async () => {
    if (!editedProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          [editingField as string]: editedProduct[editingField as keyof Product]
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({ description: "Product updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['products', product.storefront_id] });
      setEditingField(null);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        description: "Failed to update product"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const renderField = (field: string, value: any, type: 'text' | 'number' | 'textarea' = 'text') => {
    if (editingField === field) {
      if (type === 'textarea') {
        return (
          <Textarea
            value={editedProduct?.[field as keyof Product] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full min-h-[60px]"
            autoFocus
          />
        );
      }
      return (
        <Input
          type={type}
          value={editedProduct?.[field as keyof Product] || ''}
          onChange={(e) => handleChange(field, type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full"
          autoFocus
        />
      );
    }
    
    if (field === 'price') {
      return (
        <p 
          className="text-lg font-bold cursor-pointer" 
          style={{ color: accentColor }}
          onDoubleClick={() => handleDoubleClick(field)}
        >
          {formatCurrency(value)}
        </p>
      );
    }
    
    return (
      <p 
        className={`${field === 'name' ? 'text-xl font-semibold' : 'text-sm text-gray-600'} cursor-pointer`}
        onDoubleClick={() => handleDoubleClick(field)}
      >
        {value}
      </p>
    );
  };

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-lg border shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-50 rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-sm transition-all duration-200"
          onClick={onClose}
        >
          <X className="h-4 w-4" style={{ color: accentColor }} />
        </Button>

        <div>
          <div className="aspect-square w-full overflow-hidden">
            <ProductMediaCarousel 
              media={product.product_media || []}
              allowDownload={allowDownload}
            />
          </div>
          
          <div className="p-4 space-y-3 bg-white">
            {renderField('name', product.name)}
            {product.price !== null && renderField('price', product.price, 'number')}
            {product.description && renderField('description', product.description, 'textarea')}
            {product.category && (
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Category: {product.category}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};