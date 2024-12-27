import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { GalleryForm } from "./GalleryForm";
import { GalleryTable } from "./gallery/GalleryTable";
import { GallerySearch } from "./gallery/GallerySearch";
import { GalleryDeleteDialog } from "./gallery/GalleryDeleteDialog";

export const GalleryList = ({ businessId }: { businessId?: string }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<any>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries", businessId, searchQuery],
    queryFn: async () => {
      console.log("Fetching galleries...");
      let query = supabase
        .from("galleries")
        .select("*")
        .order("created_at", { ascending: false });

      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching galleries:", error);
        throw error;
      }

      console.log("Galleries fetched:", data);
      return data;
    },
  });

  const handleEdit = (gallery: any) => {
    setSelectedGallery(gallery);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!galleryToDelete) return;

    try {
      console.log("Deleting gallery:", galleryToDelete.id);
      const { error } = await supabase
        .from("galleries")
        .delete()
        .eq("id", galleryToDelete.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      toast({ description: "Gallery deleted successfully" });
      console.log("Gallery deleted successfully");
    } catch (error) {
      console.error("Error deleting gallery:", error);
      toast({
        variant: "destructive",
        description: "There was an error deleting the gallery",
      });
    } finally {
      setGalleryToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading galleries...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Galleries</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Gallery</Button>
      </div>

      <GallerySearch value={searchQuery} onChange={setSearchQuery} />

      <GalleryTable
        galleries={galleries || []}
        onEdit={handleEdit}
        onDelete={setGalleryToDelete}
      />

      <GalleryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedGallery(null);
        }}
        businessId={businessId}
        gallery={selectedGallery}
      />

      <GalleryDeleteDialog
        isOpen={!!galleryToDelete}
        onClose={() => setGalleryToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};