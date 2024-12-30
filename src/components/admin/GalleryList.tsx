import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GalleryForm } from "./GalleryForm";
import { GalleryTable } from "./gallery/GalleryTable";
import { GallerySearch } from "./gallery/GallerySearch";
import { GalleryDeleteDialog } from "./gallery/GalleryDeleteDialog";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type StorefrontWithBusiness = Database['public']['Tables']['storefronts']['Row'] & {
  businesses: {
    name: string;
  } | null;
};

export const GalleryList = ({ businessId }: { businessId?: string }) => {
  const [selectedGallery, setSelectedGallery] = useState<StorefrontWithBusiness | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<StorefrontWithBusiness | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["storefronts", businessId, searchQuery],
    queryFn: async () => {
      console.log("Fetching storefronts...");
      let query = supabase
        .from("storefronts")
        .select(`
          *,
          businesses (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching storefronts:", error);
        throw error;
      }

      console.log("Storefronts fetched:", data);
      return data as StorefrontWithBusiness[];
    },
  });

  const handleEdit = (gallery: StorefrontWithBusiness) => {
    setSelectedGallery(gallery);
    navigate(`/admin/storefront/${gallery.id}`);
  };

  const handleDelete = async () => {
    if (!galleryToDelete) return;

    try {
      console.log("Deleting storefront:", galleryToDelete.id);
      
      // First, delete all associated products
      const { error: productsError } = await supabase
        .from("products")
        .delete()
        .eq("storefront_id", galleryToDelete.id);

      if (productsError) {
        console.error("Error deleting associated products:", productsError);
        throw productsError;
      }

      // Then delete the storefront
      const { error } = await supabase
        .from("storefronts")
        .delete()
        .eq("id", galleryToDelete.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      toast({ description: "Storefront deleted successfully" });
      console.log("Storefront deleted successfully");
    } catch (error) {
      console.error("Error deleting storefront:", error);
      toast({
        variant: "destructive",
        description: "There was an error deleting the storefront",
      });
    } finally {
      setGalleryToDelete(null);
    }
  };

  const handleAddStorefront = () => {
    console.log("Navigating to new storefront page");
    navigate("/admin/storefront/new");
  };

  if (isLoading) {
    return <div>Loading storefronts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Storefronts</h2>
        <Button onClick={handleAddStorefront}>Add Storefront</Button>
      </div>

      <GallerySearch value={searchQuery} onChange={setSearchQuery} />

      <GalleryTable
        galleries={galleries || []}
        onEdit={handleEdit}
        onDelete={setGalleryToDelete}
      />

      <GalleryDeleteDialog
        isOpen={!!galleryToDelete}
        onClose={() => setGalleryToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};