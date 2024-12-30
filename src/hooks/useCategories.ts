import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCategories = (storefrontId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", storefrontId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("storefront_id", storefrontId);

      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }

      return data || [];
    },
  });

  const addCategory = async (name: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .insert({ name, storefront_id: storefrontId });

      if (error) throw error;

      toast({ description: "Category added successfully" });
      queryClient.invalidateQueries({ queryKey: ["categories", storefrontId] });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        variant: "destructive",
        description: "Failed to add category",
      });
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Category updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["categories", storefrontId] });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        description: "Failed to update category",
      });
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Category deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["categories", storefrontId] });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete category",
      });
    }
  };

  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};