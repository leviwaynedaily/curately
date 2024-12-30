import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { gallerySchema } from "@/lib/validations/gallery";

export const useStorefrontWizard = (businessId?: string, onClose: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      name: "",
      description: "",
      business_id: businessId || "",
      status: "active",
    },
  });

  const nextStep = async () => {
    const currentStepValid = await form.trigger(step === 1 ? ["name"] : ["description"]);
    if (currentStepValid) {
      setStep(step + 1);
    }
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (values: any) => {
    console.log("Submitting wizard form with values:", values);
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("storefronts")
        .insert({
          ...values,
          business_id: businessId,
          status: "active"
        })
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