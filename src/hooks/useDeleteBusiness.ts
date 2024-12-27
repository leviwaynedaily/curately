import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteBusiness = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteBusiness = async (businessId: string) => {
    try {
      console.log("Deleting business:", businessId);
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", businessId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      toast({ description: "Business deleted successfully" });
      console.log("Business deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting business:", error);
      toast({
        variant: "destructive",
        description: "There was an error deleting the business",
      });
      return false;
    }
  };

  return { deleteBusiness };
};