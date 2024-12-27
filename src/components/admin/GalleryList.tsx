import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export const GalleryList = ({ businessId }: { businessId?: string }) => {
  const { data: galleries, isLoading } = useQuery({
    queryKey: ["galleries", businessId],
    queryFn: async () => {
      console.log("Fetching galleries...");
      let query = supabase.from("galleries").select("*");
      
      if (businessId) {
        query = query.eq("business_id", businessId);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching galleries:", error);
        throw error;
      }

      console.log("Galleries fetched:", data);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading galleries...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Galleries</h2>
        <Button>Add Gallery</Button>
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
              <TableCell>{new Date(gallery.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};