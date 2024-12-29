import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gallerySchema, type GalleryFormValues } from "@/lib/validations/gallery";
import { getDefaultValues } from "./gallery/useGalleryFormDefaults";
import { useGalleryFormSubmit } from "./gallery/useGalleryFormSubmit";

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
    page_title?: string;
    favicon?: string;
    instructions_enabled?: boolean;
    instructions_content?: string;
    instructions_button_text?: string;
    pwa_icon_192?: string;
    pwa_icon_512?: string;
    show_description?: boolean;
  };
};

export const useGalleryForm = ({ onClose, businessId, gallery }: UseGalleryFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  console.log("Initializing gallery form with data:", {
    businessId,
    galleryId: gallery?.id,
    showDescription: gallery?.show_description,
  });

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: getDefaultValues(gallery, businessId),
  });

  useEffect(() => {
    if (gallery) {
      console.log("Resetting form with gallery data:", {
        id: gallery.id,
        showDescription: gallery.show_description,
      });
      
      const defaultValues = getDefaultValues(gallery, businessId);
      console.log("Default values for form:", {
        showDescription: defaultValues.show_description,
      });
      
      form.reset(defaultValues);
    }
  }, [gallery, form, businessId]);

  const handleSubmit = async (values: GalleryFormValues) => {
    console.log("Submitting form with values:", values);
    setIsLoading(true);
    try {
      await useGalleryFormSubmit(toast, queryClient, onClose, gallery)(values);
      console.log("Form submitted successfully");
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