import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { GalleryImage } from "@/types/gallery";
import { Switch } from "@/components/ui/switch";

type ImageEditDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  image: GalleryImage;
  galleryId: string;
};

export const ImageEditDialog = ({
  isOpen,
  onClose,
  image,
  galleryId,
}: ImageEditDialogProps) => {
  const [title, setTitle] = useState(image.title || "");
  const [description, setDescription] = useState(image.description || "");
  const [price, setPrice] = useState(image.price?.toString() || "");
  const [isFeatured, setIsFeatured] = useState(image.is_featured || false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Updating image details:", {
        id: image.id,
        title,
        description,
        price,
        is_featured: isFeatured,
      });

      const { error } = await supabase
        .from("gallery_images")
        .update({
          title,
          description,
          price: price ? parseFloat(price) : null,
          is_featured: isFeatured,
        })
        .eq("id", image.id);

      if (error) throw error;

      toast({ description: "Image details updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["gallery", galleryId] });
      onClose();
    } catch (error) {
      console.error("Error updating image:", error);
      toast({
        variant: "destructive",
        description: "Failed to update image details",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Image Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter image title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter image description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={isFeatured}
              onCheckedChange={setIsFeatured}
            />
            <Label htmlFor="featured">Featured Image</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};