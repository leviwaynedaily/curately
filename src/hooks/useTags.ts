import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTags = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*, product_tags(product_id)");

      if (error) {
        console.error("Error fetching tags:", error);
        throw error;
      }

      return data?.map(tag => ({
        ...tag,
        productCount: tag.product_tags?.length || 0,
      })) || [];
    },
  });

  const addTag = async (name: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .insert({ name });

      if (error) throw error;

      toast({ description: "Tag added successfully" });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to add tag",
      });
    }
  };

  const updateTag = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .update({ name })
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Tag updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error updating tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to update tag",
      });
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({ description: "Tag deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast({
        variant: "destructive",
        description: "Failed to delete tag",
      });
    }
  };

  return {
    tags,
    isLoading,
    addTag,
    updateTag,
    deleteTag,
  };
};