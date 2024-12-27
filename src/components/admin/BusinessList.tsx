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
import { Edit, Trash } from "lucide-react";
import { BusinessForm } from "./BusinessForm";
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

export const BusinessList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [businessToDelete, setBusinessToDelete] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses"],
    queryFn: async () => {
      console.log("Fetching businesses...");
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching businesses:", error);
        throw error;
      }

      console.log("Businesses fetched:", data);
      return data;
    },
  });

  const handleEdit = (business: any) => {
    setSelectedBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!businessToDelete) return;

    try {
      console.log("Deleting business:", businessToDelete.id);
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", businessToDelete.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast({ description: "Business deleted successfully" });
      console.log("Business deleted successfully");
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        variant: "destructive",
        description: "There was an error deleting the business",
      });
    } finally {
      setBusinessToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Loading businesses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Businesses</h2>
        <Button onClick={() => setIsFormOpen(true)}>Add Business</Button>
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
          {businesses?.map((business) => (
            <TableRow key={business.id}>
              <TableCell>{business.name}</TableCell>
              <TableCell>{business.status}</TableCell>
              <TableCell>
                {new Date(business.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(business)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBusinessToDelete(business)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BusinessForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBusiness(null);
        }}
        business={selectedBusiness}
      />

      <AlertDialog
        open={!!businessToDelete}
        onOpenChange={() => setBusinessToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              business and all its associated data.
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