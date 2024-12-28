import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const MediaMigrationButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsLoading(true);
    console.log("Starting media migration...");

    try {
      const { data, error } = await supabase.functions.invoke('migrate-media');
      
      if (error) throw error;

      console.log("Migration results:", data);
      
      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${data.successful} files. ${data.failed} files failed.`,
      });
    } catch (error) {
      console.error("Migration failed:", error);
      toast({
        variant: "destructive",
        title: "Migration Failed",
        description: "Failed to migrate media files. Check console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleMigration} 
      disabled={isLoading}
      variant="outline"
    >
      {isLoading ? "Migrating..." : "Migrate Media Files"}
    </Button>
  );
};