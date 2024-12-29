import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useProductMedia = (productId: string) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const optimizeMedia = async (mediaId: string) => {
    setIsOptimizing(true);
    console.log(`Triggering optimization for media ID: ${mediaId}`);

    try {
      const { error } = await supabase.functions.invoke('optimize-media', {
        body: { mediaId }
      });

      if (error) throw error;

      console.log(`Optimization completed for media ID: ${mediaId}`);
      toast({ description: "Media optimized successfully" });
    } catch (error) {
      console.error('Failed to optimize media:', error);
      toast({
        variant: "destructive",
        description: "Failed to optimize media"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    isOptimizing,
    optimizeMedia
  };
};