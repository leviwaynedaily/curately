import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type GalleryFormProps = {
  isOpen: boolean;
  onClose: () => void;
  businessId?: string;
  gallery?: {
    id: string;
    name: string;
    status: string;
    password?: string;
  };
};

export const GalleryForm = ({
  isOpen,
  onClose,
  businessId,
  gallery,
}: GalleryFormProps) => {
  const [name, setName] = useState(gallery?.name || "");
  const [password, setPassword] = useState(gallery?.password || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting gallery form...");

    try {
      if (gallery?.id) {
        // Update existing gallery
        const { error } = await supabase
          .from("galleries")
          .update({ name, password: password || null })
          .eq("id", gallery.id);

        if (error) throw error;
        console.log("Gallery updated successfully");
        toast({ description: "Gallery updated successfully" });
      } else {
        // Create new gallery
        const { error } = await supabase.from("galleries").insert([
          {
            name,
            password: password || null,
            business_id: businessId,
          },
        ]);

        if (error) throw error;
        console.log("Gallery created successfully");
        toast({ description: "Gallery created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      onClose();
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the gallery",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gallery ? "Edit Gallery" : "Add Gallery"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Gallery name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password (optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};