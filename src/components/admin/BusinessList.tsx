import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BusinessForm } from "./BusinessForm";
import { BusinessTable } from "./business/BusinessTable";
import { BusinessDeleteDialog } from "./business/BusinessDeleteDialog";
import { BusinessListHeader } from "./business/BusinessListHeader";

export const BusinessList = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [businessToDelete, setBusinessToDelete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: businesses, isLoading } = useQuery({
    queryKey: ["businesses", searchQuery],
    queryFn: async () => {
      console.log("Fetching businesses...");
      let query = supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query;

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
      <BusinessListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsFormOpen(true)}
      />

      <BusinessTable
        businesses={businesses || []}
        onEdit={handleEdit}
        onDelete={setBusinessToDelete}
      />

      <BusinessForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBusiness(null);
        }}
        business={selectedBusiness}
      />

      <BusinessDeleteDialog
        isOpen={!!businessToDelete}
        onClose={() => setBusinessToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};