import { supabase } from "@/integrations/supabase/client";
import { GalleryFormValues } from "@/lib/validations/gallery";
import { QueryClient } from "@tanstack/react-query";
import { Storefront } from "@/types/storefront";

export const useGalleryFormSubmit = (
  toast: (props: { description: string; variant?: "default" | "destructive" }) => void,
  queryClient: QueryClient,
  onClose: () => void,
  gallery?: { id: string }
) => {
  const handleSubmit = async (values: GalleryFormValues): Promise<Storefront | null> => {
    console.log("Starting gallery form submission with values:", values);

    // Extract all fields except currentTab
    const { currentTab, ...sanitizedValues } = values;
    
    // Create submission data object with explicit PWA icon fields
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
    console.log("PWA icons in submission:", {
      pwa_icon_192: dataToSubmit.pwa_icon_192,
      pwa_icon_512: dataToSubmit.pwa_icon_512
    });
    
    try {
      let result: Storefront | null = null;
      
      if (gallery?.id) {
        console.log("Updating existing storefront:", gallery.id);
        
        const { data, error } = await supabase
          .from("storefronts")
          .update(dataToSubmit)
          .eq("id", gallery.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating storefront:", error);
          throw error;
        }
        
        console.log("Storefront updated successfully. Response:", data);
        toast({ description: "Storefront updated successfully" });
        result = data;
      } else {
        console.log("Creating new storefront");
        
        const { data, error } = await supabase
          .from("storefronts")
          .insert(dataToSubmit)
          .select()
          .single();

        if (error) {
          console.error("Error creating storefront:", error);
          throw error;
        }
        
        console.log("Storefront created successfully. Response:", data);
        toast({ description: "Storefront created successfully" });
        result = data;
      }

      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      onClose();
      return result;
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