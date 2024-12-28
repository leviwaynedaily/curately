import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryFormValues } from "@/lib/validations/gallery";

type UseGalleryFormProps = {
  onClose: () => void;
  businessId?: string;
  gallery?: {
    id: string;
    name: string;
    status: string;
    password?: string;
    business_id?: string;
    logo?: string;
    site_logo?: string;
    description?: string;
    primary_color?: string;
    secondary_color?: string;
    accent_color?: string;
    primary_font_color?: string;
    secondary_font_color?: string;
    accent_font_color?: string;
    heading_text?: string;
    subheading_text?: string;
    age_verification_text?: string;
    button_text?: string;
    age_verification_enabled?: boolean;
    password_required?: boolean;
  };
};

export const useGalleryForm = ({ onClose, businessId, gallery }: UseGalleryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      name: gallery?.name || "",
      password: gallery?.password || "",
      status: gallery?.status || "active",
      business_id: gallery?.business_id || businessId || "",
      logo: gallery?.logo || "",
      site_logo: gallery?.site_logo || gallery?.logo || "",
      description: gallery?.description || "",
      primary_color: gallery?.primary_color || "#141413",
      secondary_color: gallery?.secondary_color || "#E6E4DD",
      accent_color: gallery?.accent_color || "#9b87f5",
      primary_font_color: gallery?.primary_font_color || "#000000",
      secondary_font_color: gallery?.secondary_font_color || "#6E59A5",
      accent_font_color: gallery?.accent_font_color || "#8B5CF6",
      heading_text: gallery?.heading_text || "Age Verification Required",
      subheading_text: gallery?.subheading_text || "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
      age_verification_text: gallery?.age_verification_text || "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
      button_text: gallery?.button_text || "Enter Site",
      age_verification_enabled: gallery?.age_verification_enabled || false,
      password_required: gallery?.password_required || false,
      currentTab: "basic",
    },
  });

  useEffect(() => {
    if (gallery) {
      console.log("Resetting form with gallery data:", gallery);
      form.reset({
        name: gallery.name,
        password: gallery.password || "",
        status: gallery.status,
        business_id: gallery.business_id || "",
        logo: gallery.logo || "",
        site_logo: gallery.site_logo || gallery.logo || "",
        description: gallery.description || "",
        primary_color: gallery.primary_color || "#141413",
        secondary_color: gallery.secondary_color || "#E6E4DD",
        accent_color: gallery.accent_color || "#9b87f5",
        primary_font_color: gallery.primary_font_color || "#000000",
        secondary_font_color: gallery.secondary_font_color || "#6E59A5",
        accent_font_color: gallery.accent_font_color || "#8B5CF6",
        heading_text: gallery.heading_text || "Age Verification Required",
        subheading_text: gallery.subheading_text || "This website contains age-restricted content. By entering, you accept our terms and confirm your legal age to view such content.",
        age_verification_text: gallery.age_verification_text || "I confirm that I am 21 years of age or older and agree to the Terms of Service and Privacy Policy.",
        button_text: gallery.button_text || "Enter Site",
        age_verification_enabled: gallery.age_verification_enabled || false,
        password_required: gallery.password_required || false,
        currentTab: "basic",
      });
    }
  }, [gallery, form]);

  const handleSubmit = async (values: GalleryFormValues) => {
    setIsLoading(true);
    console.log("Submitting gallery form...", values);

    // Remove currentTab from values before sending to API and ensure required fields
    const { currentTab, ...rest } = values;
    const sanitizedValues = {
      name: values.name, // This is required
      status: values.status || "active",
      business_id: values.business_id,
      password: values.password,
      logo: values.logo,
      site_logo: values.site_logo,
      description: values.description,
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
      age_verification_enabled: values.age_verification_enabled,
      password_required: values.password_required,
    };

    try {
      if (gallery?.id) {
        const { error } = await supabase
          .from("galleries")
          .update(sanitizedValues)
          .eq("id", gallery.id);

        if (error) throw error;
        console.log("Gallery updated successfully");
        toast({ description: "Gallery updated successfully" });
      } else {
        const { error } = await supabase
          .from("galleries")
          .insert(sanitizedValues);

        if (error) throw error;
        console.log("Gallery created successfully");
        toast({ description: "Gallery created successfully" });
      }

      queryClient.invalidateQueries({ queryKey: ["galleries"] });
      onClose();
    } catch (error) {
      console.error("Error saving gallery:", error);
      toast({
        variant: "destructive",
        description: "There was an error saving the gallery",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    handleSubmit,
  };
};