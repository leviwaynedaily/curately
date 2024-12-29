import { supabase } from "@/integrations/supabase/client";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { QueryClient } from "@tanstack/react-query";

export const useGalleryFormSubmit = (
  toast: (props: { description: string; variant?: "default" | "destructive" }) => void,
  queryClient: QueryClient,
  onClose: () => void,
  gallery?: { id: string }
) => {
  const handleSubmit = async (values: GalleryFormValues) => {
    console.log("Starting gallery form submission with values:", values);

    // Extract all fields except currentTab
    const { currentTab, ...sanitizedValues } = values;
    
    // Create submission data object
    const dataToSubmit = {
      ...sanitizedValues,
      name: values.name,
      page_title: values.page_title || values.name,
      instructions_enabled: values.instructions_enabled,
      instructions_content: values.instructions_content,
      instructions_button_text: values.instructions_button_text || "Enter Site",
      pwa_icon_192: values.pwa_icon_192 || null,
      pwa_icon_512: values.pwa_icon_512 || null,
      show_description: values.show_description
    };

    console.log("Submitting storefront data:", dataToSubmit);
    
    try {
      if (gallery?.id) {
        console.log("Updating existing storefront:", gallery.id);
        console.log("Full update payload:", dataToSubmit);
        
        const { data, error } = await supabase
          .from("storefronts")
          .update(dataToSubmit)
          .eq("id", gallery.id)
          .select();

        if (error) {
          console.error("Error updating storefront:", error);
          throw error;
        }
        
        console.log("Storefront updated successfully. Full response:", data);
        toast({ description: "Storefront updated successfully" });
      } else {
        console.log("Creating new storefront");
        console.log("Full insert payload:", dataToSubmit);
        
        const { data, error } = await supabase
          .from("storefronts")
          .insert(dataToSubmit)
          .select();

        if (error) {
          console.error("Error creating storefront:", error);
          throw error;
        }
        
        console.log("Storefront created successfully. Full response:", data);
        toast({ description: "Storefront created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      onClose();
    } catch (error) {
      console.error("Error saving storefront:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the storefront",
      });
      throw error;
    }
  };

  return handleSubmit;
};