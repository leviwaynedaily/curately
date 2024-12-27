import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Search, Trash } from "lucide-react";
import { GalleryForm } from "./GalleryForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

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

      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search galleries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {galleries?.map((gallery) => (
            <TableRow key={gallery.id}>
              <TableCell>{gallery.name}</TableCell>
              <TableCell>{gallery.status}</TableCell>
              <TableCell>
                {new Date(gallery.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(gallery)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGalleryToDelete(gallery)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <GalleryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedGallery(null);
        }}
        businessId={businessId}
        gallery={selectedGallery}
      />

      <AlertDialog
        open={!!galleryToDelete}
        onOpenChange={() => setGalleryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              gallery and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};