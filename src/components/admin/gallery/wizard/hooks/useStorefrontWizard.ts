import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { gallerySchema, type GalleryFormValues } from "@/lib/validations/gallery";

export const useStorefrontWizard = (businessId: string | undefined, onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  console.log("Initializing storefront wizard with businessId:", businessId);

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      name: "",
      description: "",
      business_id: businessId || "",
      status: "active",
      show_description: true,
      primary_color: "#141413",
      secondary_color: "#E6E4DD",
      accent_color: "#9b87f5",
      primary_font_color: "#000000",
      secondary_font_color: "#6E59A5",
      accent_font_color: "#8B5CF6",
      heading_text: "Age Verification Required",
      subheading_text: "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
      age_verification_text: "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
      button_text: "Enter Site",
      instructions_button_text: "Enter Site"
    },
  });

  const nextStep = async () => {
    console.log("Attempting to move to next step");
    const currentStepValid = await form.trigger(step === 1 ? ["name"] : ["description"]);
    if (currentStepValid) {
      console.log("Step validation successful, moving to next step");
      setStep(step + 1);
    } else {
      console.log("Step validation failed");
    }
  };

  const previousStep = () => {
    console.log("Moving to previous step");
    setStep(step - 1);
  };

  const handleSubmit = async (values: GalleryFormValues) => {
    console.log("Submitting wizard form with values:", values);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("storefronts")
        .insert([{
          name: values.name,
          description: values.description,
          business_id: businessId,
          status: "active",
          show_description: true,
          primary_color: values.primary_color,
          secondary_color: values.secondary_color,
          accent_color: values.accent_color,
          primary_font_color: values.primary_font_color,
          secondary_font_color: values.secondary_font_color,
          accent_font_color: values.accent_font_color,
          heading_text: values.heading_text,
          subheading_text: values.subheading_text,
          age_verification_text: values.age_verification_text,
          button_text: values.button_text,
          instructions_button_text: values.instructions_button_text
        }])
        .select()
        .single();

      if (error) {
        console.error("Error creating storefront:", error);
        throw error;
      }

      console.log("Storefront created successfully:", data);
      
      // Invalidate the storefronts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["storefronts"] });
      
      // Show success message
      toast({ description: "Storefront created successfully" });
      
      // Close the wizard
      onClose();
      
      // Navigate to the edit page
      if (data?.id) {
        console.log("Navigating to edit page for storefront:", data.id);
        navigate(`/admin/storefront/${data.id}`);
      }
    } catch (error) {
      console.error("Error creating storefront:", error);
      toast({
        variant: "destructive",
        description: "There was an error creating the storefront",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    step,
    isSubmitting,
    nextStep,
    previousStep,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
};