import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/components/admin/gallery/products/types";
import { ProductMediaCarousel } from "./ProductMediaCarousel";
import { formatCurrency } from "@/lib/utils";
import { ProductCardActions } from "./ProductCardActions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProductDetailsDialogProps = {
  product: Product | null;
  onClose: () => void;
  allowDownload?: boolean;
  accentColor?: string;
  secondaryColor?: string;
};

export const ProductDetailsDialog = ({ 
  product, 
  onClose,
  allowDownload = false,
  accentColor = "#000000",
  secondaryColor = "#666666"
}: ProductDetailsDialogProps) => {
  const [tags, setTags] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const fetchTags = async () => {
      if (product) {
        const { data, error } = await supabase
          .from('product_tags')
          .select(`
            tag_id,
            tags (
              id,
              name
            )
          `)
          .eq('product_id', product.id);

        if (!error && data) {
          const formattedTags = data.map(item => ({
            id: item.tags.id,
            name: item.tags.name
          }));
          setTags(formattedTags);
        }
      }
    };

    fetchTags();
  }, [product]);

  if (!product) return null;

  const renderField = (label: string, value: any, type: 'text' | 'number' | 'textarea' = 'text') => {
    if (value === null || value === undefined) return null;

    let displayValue = value;
    if (type === 'number' && typeof value === 'number') {
      displayValue = formatCurrency(value);
    }

    return (
      <div className="space-y-1.5">
        {type === 'textarea' ? (
          <p 
            className="text-sm leading-relaxed whitespace-pre-wrap"
            style={{ color: secondaryColor }}
          >
            {displayValue}
          </p>
        ) : (
          <p 
            className={`${label === 'price' ? 'text-lg font-semibold' : 'text-base'}`}
            style={{ color: label === 'price' ? accentColor : 'inherit' }}
          >
            {displayValue}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogTitle className="sr-only">Product Details: {product.name}</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <ProductMediaCarousel 
              media={product.product_media || []}
              allowDownload={allowDownload}
            />
            {allowDownload && (
              <div className="absolute bottom-4 right-4">
                <ProductCardActions 
                  product={product}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            )}
          </div>
          
          <div className="p-4 space-y-3 bg-white">
            <div className="flex items-center gap-2">
              {renderField('name', product.name)}
              {product.category && (
                <Badge 
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs whitespace-nowrap"
                  style={{ 
                    backgroundColor: `${secondaryColor}15`,
                    color: secondaryColor,
                    border: `1px solid ${secondaryColor}30`
                  }}
                >
                  {product.category}
                </Badge>
              )}
            </div>
            {product.price !== null && renderField('price', product.price, 'number')}
            {product.description && renderField('description', product.description, 'textarea')}
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag.id}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs"
                    style={{ 
                      backgroundColor: `${secondaryColor}15`,
                      color: secondaryColor,
                      border: `1px solid ${secondaryColor}30`
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};