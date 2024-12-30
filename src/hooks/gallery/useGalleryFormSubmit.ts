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
    
    // Create submission data object with explicit typing
    const dataToSubmit = {
      ...sanitizedValues,
      name: values.name,
      page_title: values.page_title || values.name,
      instructions_enabled: values.instructions_enabled,
      instructions_content: values.instructions_content,
      instructions_button_text: values.instructions_button_text || "Enter Site",
      pwa_icon_192: values.pwa_icon_192 || null,
      pwa_icon_512: values.pwa_icon_512 || null,
      screenshot_desktop: values.screenshot_desktop || null,
      screenshot_mobile: values.screenshot_mobile || null,
      show_description: values.show_description,
      header_display: (values.header_display || "text") as "text" | "logo"
    };

    console.log("Submitting storefront data:", dataToSubmit);
    
    try {
      let result: Storefront | null = null;
      
      if (gallery?.id) {
        console.log("Updating existing storefront:", gallery.id);
        
        const { data, error } = await supabase
          .from("storefronts")
          .update(dataToSubmit)
          .eq("id", gallery.id)
          .select(`
            *,
            screenshot_desktop,
            screenshot_mobile,
            pwa_icon_192,
            pwa_icon_512
          `)
          .single();

        if (error) {
          console.error("Error updating storefront:", error);
          throw error;
        }
        
        console.log("Storefront updated successfully. Response:", data);
        toast({ description: "Storefront updated successfully" });
        result = data as Storefront;
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
        result = data as Storefront;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      queryClient.invalidateQueries({ queryKey: ["storefront", gallery?.id] });
      
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