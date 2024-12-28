import { Storefront } from "@/types/storefront";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type GalleryCardProps = {
  storefront: Storefront;
  onDelete: (id: string) => void;
};

export const GalleryCard = ({ storefront, onDelete }: GalleryCardProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("storefronts")
        .delete()
        .eq("id", storefront.id);

      if (error) throw error;

      onDelete(storefront.id);
      toast({ description: "Storefront deleted successfully" });
    } catch (error) {
      console.error("Error deleting storefront:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete storefront",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold">{storefront.name}</h3>
      <p className="text-sm text-gray-500">{storefront.description}</p>
      <div className="mt-4 flex justify-between">
        <Button onClick={handleDelete} variant="destructive" disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
};
