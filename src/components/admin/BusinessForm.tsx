import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type BusinessFormProps = {
  isOpen: boolean;
  onClose: () => void;
  business?: {
    id: string;
    name: string;
    status: string;
  };
};

export const BusinessForm = ({ isOpen, onClose, business }: BusinessFormProps) => {
  const [name, setName] = useState(business?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting business form...");

    try {
      if (business?.id) {
        // Update existing business
        const { error } = await supabase
          .from("businesses")
          .update({ name })
          .eq("id", business.id);

        if (error) throw error;
        console.log("Business updated successfully");
        toast({ description: "Business updated successfully" });
      } else {
        // Create new business
        const { error } = await supabase.from("businesses").insert([{ name }]);

        if (error) throw error;
        console.log("Business created successfully");
        toast({ description: "Business created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      onClose();
    } catch (error) {
      console.error("Error saving business:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the business",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{business ? "Edit Business" : "Add Business"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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