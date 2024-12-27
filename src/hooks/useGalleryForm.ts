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
    },
  });

  useEffect(() => {
    if (gallery) {
      console.log("Resetting form with gallery data:", gallery);
      form.reset({
        name: gallery.name,
        password: gallery.password,
        status: gallery.status,
        business_id: gallery.business_id || "",
      });
    }
  }, [gallery, form]);

  const handleSubmit = async (values: GalleryFormValues) => {
    setIsLoading(true);
    console.log("Submitting gallery form...", values);

    try {
      if (gallery?.id) {
        const { error } = await supabase
          .from("galleries")
          .update({
            name: values.name,
            password: values.password,
            status: values.status,
            business_id: values.business_id,
          })
          .eq("id", gallery.id);

        if (error) throw error;
        console.log("Gallery updated successfully");
        toast({ description: "Gallery updated successfully" });
      } else {
        const { error } = await supabase
          .from("galleries")
          .insert({
            name: values.name,
            password: values.password,
            status: values.status,
            business_id: values.business_id,
          });

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